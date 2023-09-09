import os
import tempfile
import asyncio
from fastapi import (
    UploadFile,
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Response,
)
from decouple import config
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma
from storage3.utils import StorageException
from sse_starlette.sse import EventSourceResponse
from langchain.memory import ConversationBufferMemory
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.chains import ConversationChain, ConversationalRetrievalChain

from utils.db import supabase
from core.prompts import (
    qna_prompt_template,
    flash_card_prompt_template,
    CHAT_PROMPT,
)
from core.functions import (
    get_chat_history,
    query_db,
    pdf_to_text_chunks,
    create_embeddings
)
from .models import QueryModel, UserMessage
from core.streaming_chain import StreamingConversationChain
from utils.functions import clean_flashcard_response
from utils.constants import PERSIST_DIRECTORY
from utils.chat_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()
memory = ConversationBufferMemory(memory_key="chat_history")
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'), temperature=1)
embedding = OpenAIEmbeddings(openai_api_key=config('OPENAI_API_KEY'))
vectorstore = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)
qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    verbose=True,
    retriever=vectorstore.as_retriever(),
    memory=memory,
    get_chat_history=get_chat_history
)
conversation = ConversationChain(
    llm=llm,
    verbose=True,
    memory=memory,
    prompt=CHAT_PROMPT
)
streaming_response_chain = StreamingConversationChain(
    openai_api_key=config('OPENAI_API_KEY'),
    temparature=1
)

@router.post("/uploadfile/")
async def upload_file(payload: UploadFile):
    """Store file temporarily to create
    embeddings (local) & upload file to cloud
    once done.

    Args:
        payload (UploadFile): the pdf document to create
        embeddings for
    """
    if payload.content_type != 'application/pdf':
        return {'message': 'Please upload a PDF file'}

    with tempfile.TemporaryDirectory(dir=".") as temp_dir:
        file_path = os.path.join(temp_dir, payload.filename)

        with open(file_path, "wb") as f:
            data = await payload.read()
            f.write(data)

        chunks = pdf_to_text_chunks(file_path=file_path)
        create_embeddings(docs=chunks, collection_name=payload.filename)
        res = supabase.storage.from_('document').upload(
            payload.filename,data, {"content-type": "application/pdf"})

    return {"message": "embeddings created successfully"}

@router.get("/getfile/")
def get_file(file_name: str):
    """get file from cloud, send file
    bytes directly as response

    Args:
        file_name (str): name of file given
    when uploading to cloud. Will come from documents
    list page as query param.

    TODO: store file locally? downloading file everytime
    not efficient.
    """
    try:
        res = supabase.storage.from_('document').download(file_name)
    except StorageException:
        return Response({"message": "Requested File Not Found"}, status_code=404)
    else:
        return Response(content=res, media_type="application/pdf")

@router.get("/allfiles/")
def get_all_files():
    """List all files from cloud"""
    res = supabase.storage.from_('document').list()
    res.pop(0) # remove default 'emptyFolderPlace' item, see Issue #9155 on supabase.
    return res

@router.post("/query/")
def ask_query(payload: QueryModel, collection_name: str):
    """Question and Answer endpoint that takes user query
    from request body, get's context via vector search
    and sends OpenAI a completion request along with the
    prompt template, queried context and the actual query.

    Args:
        payload (QueryModel): a json with just a query key
        having the actual user question as it's value

    Returns:
        a json with the response key having the response
        from OpenAI
    """
    context = query_db(payload.query, collection_name=collection_name)
    prompt = qna_prompt_template.format(
        context=' '.join(context),
        question=payload.query
    )
    return {"response": llm(prompt)}

@router.post('/flashcard/')
def generate_flashcard(payload: QueryModel, fileName: str, number: int = 1):
    """Generates "number" number of flashcards for a given topic
    by the user

    Args:
        payload (QueryModel): a json with just a query key
            having the actual user topic as it's value
        number (int, optional): number of flashcards to generate.
            Defaults to 1.

    Returns:
        a json with the response key having the response
        from OpenAI
    """
    context = query_db(payload.query, fileName)
    prompt = flash_card_prompt_template.format(
        number=number,
        context=' '.join(context), topic=payload.query
    )
    response = clean_flashcard_response(llm(prompt))
    return {"response": response}

@router.websocket("/ws/")
async def chat_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("/doc"):
                vectorstore = Chroma(
                    collection_name='google.pdf',
                    persist_directory=PERSIST_DIRECTORY,
                    embedding_function=embedding
                )
                qa.retriever = vectorstore.as_retriever()
                result = qa({"question": data})
                await manager.send_personal_message(result["answer"], websocket)
            else:
                result = conversation.predict(input=data)
                await manager.send_personal_message(result, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.send_personal_message("Chat Ended", websocket)

async def generate_response(message: str):
    callback_handler = AsyncIteratorCallbackHandler()
    llm = OpenAI(
        callbacks=[callback_handler],
        streaming=True,
        temperature=1,
        openai_api_key=config('OPENAI_API_KEY')
    )
    memory = ConversationBufferMemory(memory_key="chat_history")
    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        verbose=True,
        retriever=vectorstore.as_retriever(),
        memory=memory,
        get_chat_history=get_chat_history
    )
    conversation = ConversationChain(
        llm=llm,
        verbose=True,
        memory=memory,
        prompt=CHAT_PROMPT,
    )
    if message.startswith("/doc"):
        run = asyncio.create_task(qa({"question": message}))
    run = asyncio.create_task(conversation.apredict(input=message))
    async for token in callback_handler.aiter():
        yield token
    await run

@router.post('/stream', response_class=EventSourceResponse)
async def message_stream(user_message: UserMessage):
    return EventSourceResponse(
        streaming_response_chain.generate_response(user_message.message),
        media_type="text/event-stream"
    )

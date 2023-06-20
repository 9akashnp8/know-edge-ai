import os
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma

import tempfile
from fastapi import UploadFile, APIRouter, WebSocket, WebSocketDisconnect, Response
from fastapi.responses import FileResponse
from decouple import config
from storage3.utils import StorageException
from pathlib import Path

from .models import QueryModel
from core.prompts import qna_prompt_template, flash_card_prompt_template, CHAT_PROMPT
from core.functions import get_chat_history
from core.functions import query_db, pdf_to_text_chunks, create_embeddings
from utils.functions import clean_flashcard_response
from utils.chat_manager import ConnectionManager
from utils.db import supabase
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings.openai import OpenAIEmbeddings

from utils.constants import PERSIST_DIRECTORY

router = APIRouter()
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'), temperature=1)
manager = ConnectionManager()
memory = ConversationBufferMemory(memory_key="chat_history")
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

@router.post("/uploadfile/")
async def upload_file(payload: UploadFile):
    """Endpoint that handles creating embeddings and
    storage of document.

    Args:
        payload (UploadFile): the pdf document to create
        embeddings for

    Returns:
        json embeddings creation success message
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
def get_file(file_name: str, response: Response):
    with tempfile.TemporaryDirectory(dir=".") as temp_dir:
        file_path = os.path.join(temp_dir, file_name)
        os.path.abspath(file_path)
        # file_path = Path(__file__).parent.parent
        print(file_path)

        try:
            res = supabase.storage.from_('document').download(file_name)
        except StorageException:
            response.status_code = 400
            return {"message": "Requested File Not Found"}
        else:
            with open(file_path, 'wb+') as f:
                f.write(res)
            return FileResponse(path="google.pdf", filename="file.pdf", media_type="application/pdf")

@router.get("/allfiles/")
def get_all_files():
    res = supabase.storage.from_('document').list()
    res.pop(0)
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
    prompt = qna_prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}

@router.post('/flashcard/')
def generate_flashcard(payload: QueryModel, number: int = 1):
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
    context = query_db(payload.query)
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
                vectorstore = Chroma(collection_name='google.pdf', persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)
                qa.retriever = vectorstore.as_retriever()
                result = qa({"question": data})
                await manager.send_personal_message(result["answer"], websocket)
            else:
                result = conversation.predict(input=data)
                await manager.send_personal_message(result, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.send_personal_message("Chat Ended", websocket)
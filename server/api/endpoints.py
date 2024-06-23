import os
import glob
import json
import tempfile
from fastapi import (
    UploadFile,
    APIRouter
)
from fastapi.responses import (
    Response,
    JSONResponse,
    FileResponse,
)
# from decouple import config
from langchain_community.llms.ollama import Ollama
# from storage3.utils import StorageException
from sse_starlette.sse import EventSourceResponse
# from langchain.embeddings.openai import OpenAIEmbeddings

# from utils.db import supabase
from core.prompts import (
    flash_card_prompt_template,
)
from core.functions import (
    query_db,
    pdf_to_text_chunks,
    create_embeddings
)
from .models import QueryModel, UserMessage
from core.streaming_chain import StreamingConversationChain
from utils.functions import clean_flashcard_response
from utils.constants import mock_flashcard_response
from core.history_aware_rag import conversational_rag_chain

router = APIRouter(prefix="/api")
llm2 = Ollama(model="gemma:2b")
# embedding = OpenAIEmbeddings(openai_api_key='BNV')
streaming_response_chain = StreamingConversationChain(
    openai_api_key='BNV',
    temparature=1
)

@router.post("/documents")
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

    # TODO: store to temp dir and save to cloud
    # TODO: move core logic to background task
    file_path = os.path.join("upload-files", payload.filename)

    with open(file_path, "wb") as f:
        data = await payload.read()
        f.write(data)

    chunks = pdf_to_text_chunks(file_path=file_path)
    create_embeddings(docs=chunks)

    return {"message": "embeddings created successfully"}

@router.get("/documents/{file_name}")
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
    return FileResponse(
        f"upload-files/{file_name}.pdf",
        media_type="application/pdf"
    )

@router.get("/documents")
def get_all_files():
    """List all files from cloud"""
    all_files = [
        file.split("\\")[1]
        for file in glob.glob("upload-files/*.pdf")
    ]
    return JSONResponse(all_files)

@router.post('/flashcard/')
def generate_flashcard(payload: QueryModel, fileName: str, number: int = 1, mock: bool = False):
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
    if mock:
        return {"response": mock_flashcard_response}
    context = query_db(payload.query, fileName)
    prompt = flash_card_prompt_template.format(
        number=number,
        context=' '.join(context), topic=payload.query
    )
    response = clean_flashcard_response(llm2(prompt))
    return {"response": response}

@router.post('/stream')
async def add_msg_to_queue(user_message: UserMessage):
    """stream endpoint to generate streaming gen ai response.

    Args:
        user_message (UserMessage): Prefix user_message with "/doc"
    to chat with document, without to chat in general (but with context
    of previous chat)
    """
    def generator(input: str):
        config = {"configurable": {"session_id": "abc2"}}
        for chunk in conversational_rag_chain.stream({"input": input}, config=config):
            if "answer" in chunk:
                content = chunk["answer"]
                yield content

    message = user_message.message
    return EventSourceResponse(generator(message))

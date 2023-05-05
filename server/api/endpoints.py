from langchain.llms import OpenAI

import shutil
from fastapi import UploadFile, APIRouter
from decouple import config

from .models import QueryModel
from core.prompts import prompt_template, fc_prompt_template
from core.functions import query_db, pdf_to_text_chunks, create_embeddings
from utils.functions import clean_flashcard_response

router = APIRouter(prefix='/api')
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))

@router.post("/api/uploadfile/")
def upload_file(payload: UploadFile):

    # Save file to disk
    file_location = f"files/{payload.filename}"
    with open(file_location, "wb") as file:
        shutil.copyfileobj(payload.file, file)

    # Create embeddings (move this to background)
    chunks = pdf_to_text_chunks(file_path=file_location)
    create_embeddings(docs=chunks)
    return {"message": "embeddings created successfully"}

@router.post("/api/query/")
def ask_query(payload: QueryModel):
    context = query_db(payload.query)
    prompt = prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}

@router.post('/api/flashcard/')
def generate_flashcard(payload: QueryModel, number: int = 1):
    context = query_db(payload.query)
    prompt = fc_prompt_template.format(number=number, context=' '.join(context), topic=payload.query)
    response = clean_flashcard_response(llm(prompt))
    return {"response": response}
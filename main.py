from langchain.llms import OpenAI
from langchain.chains import LLMChain

import json
import shutil
from decouple import config
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from models import QueryModel
from core.prompts import prompt_template, fc_prompt_template
from core.utils import query_db, clean_flashcard_response, pdf_to_text_chunks, create_embeddings

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://13.127.158.156"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))

@app.post("/api/uploadfile/")
def upload_file(payload: UploadFile):

    # Save file to disk
    file_location = f"files/{payload.filename}"
    with open(file_location, "wb") as file:
        shutil.copyfileobj(payload.file, file)

    # Create embeddings (move this to background)
    chunks = pdf_to_text_chunks(file_path=file_location)
    create_embeddings(docs=chunks)
    return {"message": "embeddings created successfully"}

@app.post("/api/query/")
def ask_query(payload: QueryModel):
    context = query_db(payload.query)
    prompt = prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}

@app.post('/api/flashcard/')
def generate_flashcard(payload: QueryModel, number: int = 1):
    context = query_db(payload.query)
    prompt = fc_prompt_template.format(number=number, context=' '.join(context), topic=payload.query)
    response = clean_flashcard_response(llm(prompt))
    return {"response": response}
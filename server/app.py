from langchain.llms import OpenAI
from langchain.chains import LLMChain

import json
import shutil
from decouple import config
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

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
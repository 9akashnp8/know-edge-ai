from langchain.llms import OpenAI
from langchain.chains import LLMChain

import json
from decouple import config
from fastapi import FastAPI

from models import QueryModel
from core.prompts import prompt_template, fc_prompt_template
from core.utils import query_db, clean_flashcard_response

app = FastAPI()
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))

@app.post("/api/query/")
def ask_query(payload: QueryModel):
    context = query_db(payload.query)
    prompt = prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}

@app.post('/api/flashcard/')
def generate_flashcard(payload: QueryModel, number: int = 5):
    context = query_db(payload.query)
    prompt = fc_prompt_template.format(number=number, context=' '.join(context), topic=payload.query)
    response = clean_flashcard_response(llm(prompt))
    return {"response": response}
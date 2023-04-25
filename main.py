from langchain.llms import OpenAI
from langchain.chains import LLMChain

from decouple import config
from fastapi import FastAPI

from models import QueryModel
from core.prompts import prompt_template
from core.utils import query_db

app = FastAPI()
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))

@app.post("/api/query/")
def ask_query(payload: QueryModel):
    context = query_db(payload.query)
    prompt = prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}
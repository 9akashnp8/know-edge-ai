from langchain.llms import OpenAI
from langchain.chains import LLMChain

from decouple import config

from core.prompts import prompt
from core.utils import query_db

question = input("Enter your questions: \n")
context_from_db = query_db(question)

pruned_prompt = prompt.format(context=' '.join(context_from_db), question=question)

llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))
print(llm(pruned_prompt))
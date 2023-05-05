from langchain.llms import OpenAI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import router

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
app.include_router(router)

@app.get('/')
def root():
    return {'message': 'Study Smart AI API Root'}
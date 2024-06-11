from langchain_community.llms.ollama import Ollama

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from api.endpoints import router

api_app = FastAPI(title="api_app")
api_app.include_router(router)
origins = ["http://localhost:5173"]
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

spa_app = FastAPI(title="spa_app")
path = Path(__file__).parent.parent
static_files_dir = path / 'frontend'
spa_app.mount("/api", api_app)
spa_app.mount("/", StaticFiles(directory=static_files_dir, html=True), name="static")

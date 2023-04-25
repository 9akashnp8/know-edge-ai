# LangChain Imports
from langchain.document_loaders import PDFMinerLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings

# Other 3rd Party Imports
from decouple import config

# Internal Imports
from .constants import PERSIST_DIRECTORY

# Functions
def pdf_to_text_chunks(file_path: str, chunk_size: int = 500) -> "list[str]":
    """converts a pdf to chunks for embedding creation"""
    loader = PDFMinerLoader(file_path)
    document = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=0)
    docs = text_splitter.split_documents(document)
    return docs

def create_embeddings(docs: "list[str]") -> None:
    """creates and persists embeddings to db"""
    embeddings = OpenAIEmbeddings(openai_api_key=config('OPENAI_API_KEY'))
    db = Chroma.from_documents(docs, embeddings, persist_directory=PERSIST_DIRECTORY)
    db.persist()

def query_db(query: str, n_results: int = 5) -> list:
    """query the vector db for similar text content"""
    embedding = OpenAIEmbeddings(openai_api_key=config('OPENAI_API_KEY'))
    db = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)
    results = db.similarity_search(query, k=n_results)
    return [result.page_content for result in results]

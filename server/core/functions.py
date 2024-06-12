from langchain.document_loaders import PDFMinerLoader
from langchain_community.document_loaders.pdf import PDFMinerLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores.chroma import Chroma
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain.schema import get_buffer_string

from decouple import config

def pdf_to_text_chunks(file_path: str, chunk_size: int = 500) -> "list[str]":
    """converts a pdf to chunks for embedding creation"""
    loader = PDFMinerLoader(file_path)
    document = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=0)
    docs = text_splitter.split_documents(document)
    return docs

def create_embeddings(docs: "list[str]") -> None:
    """creates and persists embeddings to db"""
    embedding = OllamaEmbeddings(model="gemma:2b")
    Chroma.from_documents(documents=docs, embedding=embedding)

def query_db(query: str, n_results: int = 5) -> list:
    """query the vector db for similar text content"""
    embedding = OllamaEmbeddings(model="gemma:2b")
    db = Chroma(embedding_function=embedding)
    results = db.similarity_search(query, k=n_results)
    return [result.page_content for result in results]

def get_chat_history(chat_history) -> str:
    if type(chat_history) == str:
        return chat_history
    return get_buffer_string(messages=chat_history)
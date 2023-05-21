from langchain.llms import OpenAI

import shutil
from fastapi import UploadFile, APIRouter, WebSocket, WebSocketDisconnect
from decouple import config

from .models import QueryModel
from core.prompts import qna_prompt_template, flash_card_prompt_template
from core.functions import query_db, pdf_to_text_chunks, create_embeddings
from utils.functions import clean_flashcard_response
from utils.chat_manager import ConnectionManager
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

router = APIRouter()
llm = OpenAI(openai_api_key=config('OPENAI_API_KEY'))
manager = ConnectionManager()
conversation = ConversationChain(
    llm=llm, 
    verbose=True, 
    memory=ConversationBufferMemory()
)

@router.post("/uploadfile/")
def upload_file(payload: UploadFile):
    """Endpoint that handles storing of pdf document and
    creating embdeddings for the same

    Args:
        payload (UploadFile): the pdf document to create
        embeddings for

    Returns:
        json embeddings creation success message
    """
    # Validate if file is pdf
    if not payload.content_type == 'application/pdf':
        return {'message': 'Please upload a PDF file'}

    # Save file to disk
    print(payload.content_type)
    file_location = f"../files/{payload.filename}"
    with open(file_location, "wb") as file:
        shutil.copyfileobj(payload.file, file)

    # Create embeddings (move this to background)
    chunks = pdf_to_text_chunks(file_path=file_location)
    create_embeddings(docs=chunks, collection_name=payload.filename)
    return {"message": "embeddings created successfully"}

@router.post("/query/")
def ask_query(payload: QueryModel, collection_name: str):
    """Question and Answer endpoint that takes user query
    from request body, get's context via vector search
    and sends OpenAI a completion request along with the
    prompt template, queried context and the actual query.

    Args:
        payload (QueryModel): a json with just a query key
        having the actual user question as it's value

    Returns:
        a json with the response key having the response
        from OpenAI
    """
    context = query_db(payload.query, collection_name=collection_name)
    prompt = qna_prompt_template.format(context=' '.join(context), question=payload.query)
    return {"response": llm(prompt)}

@router.post('/flashcard/')
def generate_flashcard(payload: QueryModel, number: int = 1):
    """Generates "number" number of flashcards for a given topic
    by the user

    Args:
        payload (QueryModel): a json with just a query key
            having the actual user topic as it's value
        number (int, optional): number of flashcards to generate.
            Defaults to 1.

    Returns:
        a json with the response key having the response
        from OpenAI
    """
    context = query_db(payload.query)
    prompt = flash_card_prompt_template.format(
        number=number,
        context=' '.join(context), topic=payload.query
    )
    response = clean_flashcard_response(llm(prompt))
    return {"response": response}

@router.websocket("/ws/")
async def chat_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            response = conversation.predict(input=data)
            await manager.send_personal_message(response, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.send_personal_message("Chat Ended", websocket)
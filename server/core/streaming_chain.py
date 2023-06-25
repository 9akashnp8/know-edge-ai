from langchain.llms import OpenAI
from langchain.vectorstores import Chroma
from langchain.memory import ConversationBufferMemory
from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import ConversationChain, ConversationalRetrievalChain

import asyncio
from decouple import config

from utils.constants import PERSIST_DIRECTORY
from core.functions import get_chat_history
from core.prompts import CHAT_PROMPT

class StreamingConversationChain:
    memory = ConversationBufferMemory(memory_key="chat_history")
    embedding = OpenAIEmbeddings(openai_api_key=config('OPENAI_API_KEY'))
    vectorstore = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)

    def __init__(self, openai_api_key: str, temparature: float) -> None:
        self.openai_api_key = openai_api_key
        self.temperature = temparature

    async def generate_response(self, message: str):
        callback_handler = AsyncIteratorCallbackHandler()
        llm = OpenAI(
            callbacks=[callback_handler],
            streaming=True,
            temperature=self.temperature,
            openai_api_key=self.openai_api_key,
        )
        qa = ConversationalRetrievalChain.from_llm(
            llm=llm,
            verbose=True,
            retriever=self.vectorstore.as_retriever(),
            memory=self.memory,
            get_chat_history=get_chat_history
        )
        conversation = ConversationChain(
            llm=llm,
            verbose=True,
            memory=self.memory,
            prompt=CHAT_PROMPT,
        )

        if message.startswith("/doc"):
            run = asyncio.create_task(qa.arun({"question": message}))
        run = asyncio.create_task(conversation.apredict(input=message))

        async for token in callback_handler.aiter():
            yield token

        await run
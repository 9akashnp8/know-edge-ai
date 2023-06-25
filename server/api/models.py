from pydantic import BaseModel

class QueryModel(BaseModel):
    query: str

class UserMessage(BaseModel):
    message: str

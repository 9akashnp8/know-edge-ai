from langchain.prompts import PromptTemplate

qna_template = """
You are an enthusiastic AI assistant who likes helping others.

You are tasked with helping users with questions regarding certain
documents that they have.

I will help you by providing source material from the document, you
can find the same in the "Context Section" below:

Context Section:
{context}

Your duty is to take the user's question and use the data from
"Context Section" to provide an answer to the user.

If you are unsure of the answer, reply with "Sorry, I can't help you with this question".
If enough data is not present in the "Context Section", reply with "Sorry, there isn't
enough data to answer your questions"

Question:
{question}

Answer:
"""

qna_prompt_template = PromptTemplate(
    input_variables=['context', 'question'],
    template=qna_template
)

flash_card_template = """
You are an enthusiastic assistant who likes helping others.
You specialize in generating flash cards for a given topic mentioned in the
"Topic" section. Only use information from the "Context" section below.

generate {number} flashcards in the following format: a python list of dictionary
with having two keys, "q" key that contains the question and "a" key that contains
the answer

Topic:
{topic}

Context:
{context}

Generated Flashcards:
"""

flash_card_prompt_template = PromptTemplate(
    input_variables=['number', 'topic', 'context'],
    template=flash_card_template
)

CHAT_PROMPT_TEMPLATE = """The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{chat_history}
Human: {input}
AI:"""
CHAT_PROMPT = PromptTemplate(input_variables=["chat_history", "input"], template=CHAT_PROMPT_TEMPLATE)
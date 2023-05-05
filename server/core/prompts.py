from langchain.prompts import PromptTemplate

qna_template = """
You are an enthusiastic assistant who likes helping others.
From the info present in the "Context Section" below, try to
answer the user's questions. If you are unsure of the answer, reply
with "Sorry, I can't help you with this question". If enough data
is not present in the "Context Section", reply with "Sorry, there isn't
enough data to answer your questions"

Context Section:
{context}

Question:
{question}
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
import json

def clean_flashcard_response(raw_response: str) -> list:
    """
    converts the raw string response of list of dictionaires
    created by openai into actual list of dictionaries
    """
    response = raw_response.replace("'", "\"")
    return json.loads(response)

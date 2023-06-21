FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY server server
COPY frontend frontend

EXPOSE 8000

CMD ["uvicorn", "server.app:spa_app", "--host", "0.0.0.0", "--port", "8000"]
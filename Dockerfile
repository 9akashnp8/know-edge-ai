FROM python:3.11-slim
WORKDIR /app

# Install node to build front end
RUN apt-get update; \
    curl -fsSL https://deb.nodesource.com/setup_19.x | bash -; \
    apt install -y nodejs npm
COPY client client
WORKDIR /app/client
RUN rm -rf node_modules; \
    npm install; \
    npm run build
WORKDIR /app

# Continue with setting up FastAPI server
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY server server
EXPOSE 8000

CMD ["uvicorn", "server.app:spa_app", "--host", "0.0.0.0", "--port", "8000"]
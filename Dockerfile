FROM python:3.11-alpine
WORKDIR /app

# Install node to build front end
COPY client client
WORKDIR /app/client
RUN apk update; \
    rm -rf /var/cache/apk/*; \
    apk add curl; \
    apk add --update nodejs npm; \
    rm -rf /var/cache/apk/* /tmp/*; \
    rm -rf node_modules; \
    npm install; \
    npm run build
WORKDIR /app

# Continue with setting up FastAPI server
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY server server
EXPOSE 8000

CMD ["uvicorn", "server.app:spa_app", "--host", "0.0.0.0", "--port", "8000"]
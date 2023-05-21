

class ConnectionManager():

    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message, websocket):
        await websocket.send_text(message)
import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
import py_eureka_client.eureka_client as eureka_client

# 1. Port dynamique (8084 par défaut)
PORT = int(os.getenv("PORT", 8084))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Démarrage : Enregistrement auprès d'Eureka avec un instanceId unique
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="NOTIFICATION",
        instance_port=PORT,
        instance_host="localhost",
        instance_id=f"notification:{PORT}"
    )
    print(f"Notification service enregistré dans Eureka sur le port {PORT}")
    yield
    # Arrêt : Retrait propre d'Eureka
    await eureka_client.stop_async()
    print("Notification service retiré d'Eureka")

app = FastAPI(lifespan=lifespan)

# 2. Endpoint demandé par le TP
@app.get("/api/notifications/hello")
def hello():
    return {"message": "Hello from Notification service!", "port": PORT}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
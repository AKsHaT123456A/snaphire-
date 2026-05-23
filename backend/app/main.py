from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, workers, employers, jobs, hires, notifications, wallet, reviews, websocket

app = FastAPI(title="SnapHire API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(workers.router)
app.include_router(employers.router)
app.include_router(jobs.router)
app.include_router(hires.router)
app.include_router(notifications.router)
app.include_router(wallet.router)
app.include_router(reviews.router)
app.include_router(websocket.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "SnapHire API"}

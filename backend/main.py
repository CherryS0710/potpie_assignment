import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import evaluation

app = FastAPI(title="Interview Answer Evaluator API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluation.router, prefix="/api", tags=["evaluation"])

@app.get("/")
async def root():
    return {"message": "Interview Answer Evaluator API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

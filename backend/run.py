"""
Run script for the FastAPI backend.
Run this from the backend directory: python run.py
Or use: uvicorn main:app --reload --port 8000
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from pydantic import BaseModel, Field
from typing import List

class EvaluationRequest(BaseModel):
    question: str = Field(..., description="The interview question")
    job_role: str = Field(..., description="The job role being interviewed for")
    answer: str = Field(..., description="The user's answer to the question")

class EvaluationResponse(BaseModel):
    overall_score: float = Field(..., ge=0, le=10, description="Overall score from 0-10")
    strengths: List[str] = Field(..., description="List of identified strengths")
    weaknesses: List[str] = Field(..., description="List of identified weaknesses")
    improvement_tips: List[str] = Field(..., description="Actionable improvement tips")
    improved_answer: str = Field(..., description="A refined version of the answer")

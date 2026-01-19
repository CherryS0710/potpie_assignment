import logging
from fastapi import APIRouter, HTTPException
from schemas.evaluation import EvaluationRequest, EvaluationResponse
from agents.interview_evaluator import evaluate_interview_answer

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluationRequest) -> EvaluationResponse:
    """
    Evaluate an interview answer and return structured feedback.
    
    This endpoint uses a Pydantic AI agent to analyze the answer and provide:
    - Overall score (0-10)
    - Strengths
    - Weaknesses
    - Improvement tips
    - An improved version of the answer
    """
    try:
        logger.info(f"Evaluating answer for job role: {request.job_role}")
        
        result = await evaluate_interview_answer(
            question=request.question,
            job_role=request.job_role,
            answer=request.answer,
        )
        
        logger.info(f"Evaluation completed. Score: {result.overall_score}")
        return result
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Evaluation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to evaluate answer: {str(e)}"
        )

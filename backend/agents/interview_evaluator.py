import os
from typing import Optional
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from schemas.evaluation import EvaluationResponse

# Load environment variables from .env file
load_dotenv()

# Use OpenRouter for free model access
MODEL_NAME = os.getenv("MODEL_NAME", "openai/gpt-3.5-turbo")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable is required")

# Configure provider for OpenRouter
provider = OpenAIProvider(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Create model with the provider
model = OpenAIModel(
    MODEL_NAME,
    provider=provider,
)

# Create the agent with structured output
evaluator_agent = Agent(
    model=model,
    system_prompt="""You are an expert interview coach specializing in evaluating interview answers 
and providing constructive feedback. Your role is to analyze interview responses with precision and 
provide structured, actionable feedback that helps candidates improve.

Evaluation Criteria:
1. **Clarity**: Is the answer clear, well-structured, and easy to follow?
2. **Relevance**: Does the answer directly address the question asked?
3. **Specificity**: Does the answer include concrete examples, numbers, or details?
4. **Confidence**: Does the answer demonstrate confidence without arrogance?
5. **Completeness**: Does the answer fully address all aspects of the question?
6. **Professionalism**: Is the tone appropriate for an interview setting?

When providing feedback:
- Be constructive and encouraging
- Focus on actionable improvements
- Highlight what was done well
- Provide specific, measurable improvement suggestions
- Generate an improved version that incorporates best practices

Always return structured output with a numerical score (0-10), lists of strengths and weaknesses, 
improvement tips, and a refined answer.""",
    output_type=EvaluationResponse,
)

async def evaluate_interview_answer(
    question: str,
    job_role: str,
    answer: str,
) -> EvaluationResponse:
    """
    Evaluate an interview answer using the Pydantic AI agent.
    
    Args:
        question: The interview question
        job_role: The job role being interviewed for
        answer: The user's answer
    
    Returns:
        EvaluationResponse with structured feedback
    """
    try:
        result = await evaluator_agent.run(
            f"""Interview Question: {question}
            
Job Role: {job_role}

Candidate's Answer: {answer}

Please evaluate this answer based on clarity, relevance, specificity, confidence, completeness, 
and professionalism. Provide a numerical score (0-10), identify strengths and weaknesses, 
offer improvement tips, and generate a refined version of the answer."""
        )
        return result.output
    except Exception as e:
        # Fallback: Return a basic response if agent fails
        raise ValueError(f"Evaluation failed: {str(e)}")

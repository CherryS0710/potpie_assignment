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
    system_prompt="""You are an expert interview coach and hiring manager with 15+ years of experience evaluating candidates. 
Your task is to analyze interview answers and provide detailed, constructive feedback.

SCORING GUIDELINES (0-10 scale):
- 9-10: Exceptional - Comprehensive, specific, well-structured, with concrete examples
- 7-8: Good - Solid answer with most criteria met, minor improvements needed
- 5-6: Average - Adequate but missing key elements, needs significant improvement
- 3-4: Below Average - Incomplete, vague, or missing critical information
- 0-2: Poor - Does not address the question, completely incorrect, or inappropriate

EVALUATION CRITERIA:
1. Clarity: Is the answer clear, well-structured, and easy to follow? (0-10 weight: 1.5)
2. Relevance: Does it directly address the question asked? (0-10 weight: 2.0)
3. Specificity: Does it include concrete examples, numbers, details, or technical accuracy? (0-10 weight: 2.0)
4. Completeness: Does it fully address all aspects of the question? (0-10 weight: 1.5)
5. Professionalism: Is the tone appropriate and demonstrates communication skills? (0-10 weight: 1.0)
6. Technical/Job Fit: For technical roles, is the answer technically accurate? (0-10 weight: 2.0)

INSTRUCTIONS:
- Calculate overall_score as a weighted average considering all criteria
- For strengths: Identify 2-4 specific things the candidate did well
- For weaknesses: Identify 2-4 specific areas that need improvement (be constructive)
- For improvement_tips: Provide 3-5 actionable, specific suggestions
- For improved_answer: Write a complete, enhanced version that incorporates best practices, 
  adds concrete examples where relevant, improves structure, and addresses any gaps
- Be fair and encouraging - even average answers should score at least 4-5 if they address the question
- The improved_answer should be significantly better, not just a minor edit

CRITICAL: You must return valid data for ALL fields. Never return empty arrays or placeholder text.""",
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
            f"""You are evaluating an interview answer. Please provide a comprehensive evaluation.

**Interview Question:**
{question}

**Job Role Being Interviewed For:**
{job_role}

**Candidate's Answer:**
{answer}

**Your Task:**
1. Evaluate this answer on clarity, relevance, specificity, completeness, professionalism, and technical accuracy (if applicable)
2. Assign an overall_score from 0-10 (be fair - an answer that addresses the question should score at least 4-5)
3. List 2-4 specific strengths
4. List 2-4 specific areas for improvement
5. Provide 3-5 actionable improvement tips
6. Write a complete improved version of the answer that is significantly better, with:
   - Better structure and clarity
   - Concrete examples and specifics
   - More complete information
   - Professional tone
   - Technical accuracy (if applicable)

Be thorough and constructive in your evaluation and improvement."""
        )
        
        # Validate the output before returning
        output = result.output
        if not output:
            raise ValueError("Agent returned empty output")
        
        # Ensure all required fields are present and valid
        if not isinstance(output.overall_score, (int, float)) or output.overall_score < 0 or output.overall_score > 10:
            raise ValueError(f"Invalid overall_score: {output.overall_score}")
        
        if not output.strengths or len(output.strengths) == 0:
            raise ValueError("Strengths list is empty")
        
        if not output.weaknesses or len(output.weaknesses) == 0:
            raise ValueError("Weaknesses list is empty")
        
        if not output.improvement_tips or len(output.improvement_tips) == 0:
            raise ValueError("Improvement tips list is empty")
        
        if not output.improved_answer or len(output.improved_answer.strip()) == 0:
            raise ValueError("Improved answer is empty")
        
        return output
    except Exception as e:
        # Log the error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Evaluation error: {str(e)}", exc_info=True)
        raise ValueError(f"Evaluation failed: {str(e)}")

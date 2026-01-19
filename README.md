# AI Interview Answer Evaluator and Improvement Coach

A full-stack AI-powered application that evaluates interview answers and provides structured feedback to help users prepare more effectively for job interviews.

## Features

- **Structured AI Evaluation**: Uses Pydantic AI to analyze interview answers with structured outputs
- **Comprehensive Feedback**: Provides numerical scores, strengths, weaknesses, improvement tips, and refined answers
- **Clean Architecture**: Separated backend (FastAPI) and frontend (Next.js) with proper validation
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI
- **AI Framework**: Pydantic AI
- **LLM Provider**: OpenRouter (free model support)

## Project Structure

```
potpie/
├── backend/
│   ├── agents/
│   │   └── interview_evaluator.py  # Pydantic AI agent
│   ├── routes/
│   │   └── evaluation.py           # FastAPI routes
│   ├── schemas/
│   │   └── evaluation.py           # Pydantic models
│   ├── main.py                     # FastAPI app entry point
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── components/             # React components
│   │   ├── page.tsx                # Main page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.11.9 (exact version required for deployment compatibility)
- Node.js 18+
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

5. Add your OpenRouter API key to `.env`:
```
OPENROUTER_API_KEY=your_api_key_here
MODEL_NAME=openai/gpt-3.5-turbo
```

6. Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open the application in your browser
2. Enter an interview question
3. Select or specify the job role
4. Provide your answer
5. Click "Evaluate Answer"
6. Review the structured feedback:
   - Overall score (0-10)
   - Strengths
   - Areas for improvement
   - Improvement tips
   - Improved answer version

## API Endpoints

### POST `/api/evaluate`

Evaluate an interview answer.

**Request Body:**
```json
{
  "question": "Tell me about yourself",
  "job_role": "Software Engineer",
  "answer": "I am a software engineer..."
}
```

**Response:**
```json
{
  "overall_score": 7.5,
  "strengths": ["Clear communication", "Relevant experience"],
  "weaknesses": ["Lacks specific examples", "Could be more concise"],
  "improvement_tips": ["Add concrete examples", "Use the STAR method"],
  "improved_answer": "Improved version of the answer..."
}
```

## Environment Variables

### Backend (.env)
- `OPENROUTER_API_KEY` (required): Your OpenRouter API key
- `MODEL_NAME` (optional): Model to use (default: `openai/gpt-3.5-turbo`)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` (optional): Backend API URL (default: `http://localhost:8000`)

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Overview

**Backend (Render):**
1. Push code to GitHub
2. Create Web Service on Render
3. Set root directory to `backend`
4. Configure environment variables
5. Deploy

**Frontend (Vercel):**
1. Import GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

## Development

- Backend API docs: `http://localhost:8000/docs`
- Frontend runs on: `http://localhost:3000`

## License

MIT

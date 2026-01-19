'use client'

import { useState } from 'react'
import EvaluationForm from './components/EvaluationForm'
import EvaluationResults from './components/EvaluationResults'

export interface EvaluationResponse {
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  improvement_tips: string[]
  improved_answer: string
}

export default function Home() {
  const [results, setResults] = useState<EvaluationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async (question: string, jobRole: string, answer: string) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          job_role: jobRole,
          answer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to evaluate answer' }))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Interview Answer Evaluator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get structured feedback on your interview answers. Receive scores, strengths, weaknesses, 
            improvement tips, and a refined version of your response.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <EvaluationForm onSubmit={handleEvaluate} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
            <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {results && <EvaluationResults results={results} />}
      </div>
    </main>
  )
}

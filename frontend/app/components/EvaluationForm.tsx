'use client'

import { useState, FormEvent } from 'react'

interface EvaluationFormProps {
  onSubmit: (question: string, jobRole: string, answer: string) => void
  loading: boolean
}

const COMMON_JOB_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'DevOps Engineer',
  'Other',
]

export default function EvaluationForm({ onSubmit, loading }: EvaluationFormProps) {
  const [question, setQuestion] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [customJobRole, setCustomJobRole] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const finalJobRole = jobRole === 'Other' ? customJobRole : jobRole
    
    if (!question.trim() || !finalJobRole.trim() || !answer.trim()) {
      return
    }

    onSubmit(question, finalJobRole, answer)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interview Question *
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the interview question..."
          required
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      <div>
        <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Job Role *
        </label>
        <select
          id="jobRole"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select a job role...</option>
          {COMMON_JOB_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {jobRole === 'Other' && (
        <div>
          <label htmlFor="customJobRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specify Job Role *
          </label>
          <input
            id="customJobRole"
            type="text"
            value={customJobRole}
            onChange={(e) => setCustomJobRole(e.target.value)}
            placeholder="Enter job role..."
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}

      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Answer *
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer to the question..."
          required
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Evaluating...
          </>
        ) : (
          'Evaluate Answer'
        )}
      </button>
    </form>
  )
}

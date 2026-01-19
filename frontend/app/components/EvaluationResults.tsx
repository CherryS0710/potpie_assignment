'use client'

import { EvaluationResponse } from '../page'

interface EvaluationResultsProps {
  results: EvaluationResponse
}

export default function EvaluationResults({ results }: EvaluationResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 ${getScoreBgColor(results.overall_score)}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Score</h2>
          <div className={`text-5xl font-bold ${getScoreColor(results.overall_score)}`}>
            {results.overall_score.toFixed(1)}<span className="text-2xl">/10</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              results.overall_score >= 8
                ? 'bg-green-500'
                : results.overall_score >= 6
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${(results.overall_score / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h2>
          <ul className="space-y-3">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Areas for Improvement
          </h2>
          <ul className="space-y-3">
            {results.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Improvement Tips
        </h2>
        <ul className="space-y-3">
          {results.improvement_tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">→</span>
              <span className="text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Improved Answer */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Improved Answer
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {results.improved_answer}
          </p>
        </div>
      </div>
    </div>
  )
}

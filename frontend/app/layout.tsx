import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Interview Answer Evaluator',
  description: 'Get structured feedback on your interview answers with AI-powered evaluation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

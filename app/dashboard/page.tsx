// app/dashboard/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <div className="rounded-md border border-gray-700 p-4 bg-zinc-900">
        <p className="text-lg">
          You are logged in as: <strong>{session.user.email}</strong>
        </p>
      </div>
    </main>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

type PromptRun = {
  id: string
  prompt: string
  result: string
  created_at: string
}

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState<string | null>(null)
  const [history, setHistory] = useState<PromptRun[]>([])
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: string; comment: string }>>({})
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient<Database>()

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null)
    })

    supabase
      .from('prompt_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setHistory(data as PromptRun[])
        }
      })
  }, [])

  const handleSignout = async () => {
    await fetch('/signout', { method: 'POST' })
    router.push('/login')
  }

  const handleRunPrompt = async () => {
    const res = await fetch('/api/run-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setOutput(data.result)

    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        prompt,
        result: data.result,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const reusePrompt = (text: string) => {
    setPrompt(text)
    setOutput(null)
  }

  const handleFeedbackChange = (id: string, field: 'rating' | 'comment', value: string) => {
    setFeedbacks((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const submitFeedback = async (runId: string) => {
    const supabase = createBrowserClient<Database>()
    const feedback = feedbacks[runId]

    if (!feedback || !feedback.rating) return alert('Please select a thumbs up or down.')

    const { error } = await supabase.from('prompt_feedback').insert({
      prompt_run_id: runId,
      rating: feedback.rating,
      comment: feedback.comment,
    })

    if (!error) {
      alert('Feedback submitted!')
    } else {
      alert('Error submitting feedback.')
      console.error(error)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Logged in as: {userEmail}</p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ width: '100%', height: '100px', marginBottom: '1rem' }}
      />

      <div>
        <button onClick={handleRunPrompt}>Run Prompt</button>
        <button onClick={handleSignout} style={{ marginLeft: '1rem' }}>
          Sign Out
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Output</h2>
        <pre>{output}</pre>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Prompt History</h2>
        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          <ul>
            {history.map((item) => (
              <li key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }}>
                <strong>Prompt:</strong> {item.prompt}
                <br />
                <strong>Result:</strong> {item.result}
                <br />
                <button onClick={() => reusePrompt(item.prompt)} style={{ marginTop: '0.5rem' }}>
                  Reuse Prompt
                </button>

                <div style={{ marginTop: '1rem' }}>
                  <strong>Feedback:</strong>
                  <div style={{ margin: '0.5rem 0' }}>
                    <label>
                      <input
                        type="radio"
                        name={`rating-${item.id}`}
                        value="up"
                        checked={feedbacks[item.id]?.rating === 'up'}
                        onChange={(e) => handleFeedbackChange(item.id, 'rating', e.target.value)}
                      />
                      👍
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                      <input
                        type="radio"
                        name={`rating-${item.id}`}
                        value="down"
                        checked={feedbacks[item.id]?.rating === 'down'}
                        onChange={(e) => handleFeedbackChange(item.id, 'rating', e.target.value)}
                      />
                      👎
                    </label>
                  </div>
                  <textarea
                    placeholder="Optional comment..."
                    value={feedbacks[item.id]?.comment || ''}
                    onChange={(e) => handleFeedbackChange(item.id, 'comment', e.target.value)}
                    style={{ width: '100%', height: '60px' }}
                  />
                  <button onClick={() => submitFeedback(item.id)} style={{ marginTop: '0.5rem' }}>
                    Submit Feedback
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

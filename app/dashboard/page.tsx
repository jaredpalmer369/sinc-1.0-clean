'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<PromptRun[]>([])
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
    if (!prompt.trim()) {
      setError('Please enter a prompt.')
      return
    }

    setLoading(true)
    setOutput(null)
    setError(null)

    try {
      const res = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      if (res.ok) {
        setOutput(data.result)

        // Push to top of list
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            prompt,
            result: data.result,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const reusePrompt = (text: string) => {
    setPrompt(text)
    setOutput(null)
    setError(null)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
      {userEmail && <p className="mb-4">Logged in as: {userEmail}</p>}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-xl h-32 p-3 border rounded mb-4"
        placeholder="Enter your prompt here..."
      />

      <button
        onClick={handleRunPrompt}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Prompt'}
      </button>

      {output && (
        <div className="mt-6 w-full max-w-xl p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Output:</h2>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <h2 className="mt-12 text-2xl font-semibold">Prompt History</h2>
      <ul className="mt-4 w-full max-w-xl space-y-3">
        {history.length === 0 && (
          <li className="text-gray-500">No prompts run yet.</li>
        )}
        {history.map((item) => (
          <li
            key={item.id}
            className="border border-blue-400 bg-white rounded p-4 shadow-sm"
          >
            <p className="font-bold">Prompt:</p>
            <pre className="whitespace-pre-wrap">{item.prompt}</pre>
            <p className="font-bold mt-2">Result:</p>
            <pre className="whitespace-pre-wrap">{item.result}</pre>
            <button
              className="mt-3 px-3 py-1 bg-blue-100 text-sm text-blue-800 rounded hover:bg-blue-200"
              onClick={() => reusePrompt(item.prompt)}
            >
              Reuse Prompt
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSignout}
        className="mt-12 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Prompt = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

type Execution = {
  id: string
  prompt_id: string
  user_id: string
  output: string
  created_at: string
}

export default function PromptPage({ params }: { params: { promptId: string } }) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingPrompt, setFetchingPrompt] = useState(true)
  const [executions, setExecutions] = useState<Execution[]>([])
  const router = useRouter()

  // Fetch prompt on load
  useEffect(() => {
    const fetchPrompt = async () => {
      setFetchingPrompt(true)
      try {
        const res = await fetch(`/api/prompt?id=${params.promptId}`)
        const data = await res.json()
        if (res.ok) {
          setPrompt(data.prompt)
        } else {
          router.push('/dashboard')
        }
      } catch (err) {
        router.push('/dashboard')
      }
      setFetchingPrompt(false)
    }

    fetchPrompt()
  }, [params.promptId, router])

  // Fetch executions on load
  useEffect(() => {
    const fetchExecutions = async () => {
      const res = await fetch(`/api/executions?promptId=${params.promptId}`)
      const data = await res.json()
      if (res.ok) {
        setExecutions(data.executions || [])
      }
    }

    fetchExecutions()
  }, [params.promptId])

  // Run prompt
  const runPrompt = async () => {
    setLoading(true)
    setOutput(null)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: params.promptId }),
      })

      const data = await res.json()

      if (res.ok) {
        setOutput(data.output)

        // Refresh executions list after new run
        const newExecution = {
          id: crypto.randomUUID(),
          prompt_id: params.promptId,
          user_id: prompt?.user_id || '',
          output: data.output,
          created_at: new Date().toISOString(),
        }

        setExecutions((prev) => [newExecution, ...prev])
      } else {
        setOutput(`Error: ${data.error || 'Something went wrong'}`)
      }
    } catch (err) {
      setOutput('Unexpected error occurred.')
    }

    setLoading(false)
  }

  if (fetchingPrompt) return <div className="p-6">Loading prompt...</div>
  if (!prompt) return <div className="p-6">Prompt not found.</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{prompt.content}</p>

      <button
        onClick={runPrompt}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        {loading ? 'Running...' : 'Run Prompt'}
      </button>

      {output && (
        <div className="mt-6 p-4 bg-gray-100 border rounded whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Output:</h2>
          <p>{output}</p>
        </div>
      )}

      {executions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Execution History</h3>
          <ul className="space-y-4">
            {executions.map((exec) => (
              <li key={exec.id} className="p-4 border rounded bg-white shadow">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(exec.created_at).toLocaleString()}
                </div>
                <pre className="whitespace-pre-wrap">{exec.output}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

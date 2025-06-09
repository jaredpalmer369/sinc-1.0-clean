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

export default function PromptPage({ params }: { params: { promptId: string } }) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingPrompt, setFetchingPrompt] = useState(true)
  const router = useRouter()

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
    </div>
  )
}

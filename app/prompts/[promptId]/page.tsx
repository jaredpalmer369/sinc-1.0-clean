'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { executePrompt } from '@/lib/executePrompt'

export default function PromptPage({ params }: { params: { promptId: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [promptTitle, setPromptTitle] = useState('')
  const [promptText, setPromptText] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [runCount, setRunCount] = useState(0)
  const [analytics, setAnalytics] = useState<{ avg_tokens: number; avg_latency: number } | null>(null)
  const [history, setHistory] = useState<
    { output_text: string; created_at: string }[]
  >([])

  useEffect(() => {
    const fetchPrompt = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('title, content, run_count')
        .eq('id', params.promptId)
        .single()

      if (error) {
        console.error(error)
        router.push('/dashboard')
      } else {
        setPromptTitle(data.title || 'Untitled Prompt')
        setPromptText(data.content)
        setRunCount(data.run_count || 0)
      }
    }

    const fetchAnalytics = async () => {
      const { data, error } = await supabase.rpc('get_prompt_analytics', {
        p_id: params.promptId,
      })

      if (!error && data?.length) {
        setAnalytics(data[0])
      }
    }

   const fetchHistory = async () => {
  const { data, error } = await supabase
    .from('prompt_outputs')
    .select('output_text, created_at')
    .eq('prompt_id', params.promptId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

      if (!error) {
        setHistory(data || [])
      }
    }

    fetchPrompt()
    fetchHistory()
    fetchAnalytics()
  }, [params.promptId, supabase, router])

  const handleRun = async () => {
    setLoading(true)
    try {
      const result = await executePrompt(promptText, params.promptId)
      setOutput(result)

      const [promptRes, historyRes, analyticsRes] = await Promise.all([
        supabase.from('prompts').select('run_count').eq('id', params.promptId).single(),
        supabase
          .from('prompt_outputs')
          .select('output_text, created_at')
          .eq('prompt_id', params.promptId)
          .order('created_at', { ascending: false }),
        supabase.rpc('get_prompt_analytics', { p_id: params.promptId }),
      ])

      if (!promptRes.error && promptRes.data) {
        setRunCount(promptRes.data.run_count || 0)
      }

      if (!historyRes.error && historyRes.data) {
        setHistory(historyRes.data)
      }

      if (!analyticsRes.error && analyticsRes.data?.length) {
        setAnalytics(analyticsRes.data[0])
      }
    } catch (err) {
      console.error('Prompt execution error:', err)
      setOutput('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{promptTitle}</h1>

      <pre className="mb-2 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {promptText}
      </pre>

      <p className="text-sm text-gray-500">
        Run Count: <span className="font-semibold">{runCount}</span>
      </p>

      {analytics && (
        <p className="text-sm text-gray-500 mb-4">
          Avg Usage: <span className="font-semibold">{analytics.avg_tokens}</span> tokens,{' '}
          <span className="font-semibold">{analytics.avg_latency}</span> ms
        </p>
      )}

      <button
        onClick={handleRun}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Prompt'}
      </button>

      {output && (
        <div className="mt-6 p-4 bg-green-100 rounded shadow">
          <h2 className="font-bold mb-2">Output:</h2>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-lg mb-2">History</h2>
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded border">
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(item.created_at).toLocaleString()}
                </div>
                <pre className="whitespace-pre-wrap">{item.output_text}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

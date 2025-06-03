'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function NewPromptPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to create a prompt.')
      return
    }

    const { error } = await supabase.from('prompts').insert([
      {
        user_id: user.id,
        title,
        content,
        type: 'text',
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error('Insert error:', error)
      setError('Something went wrong while saving your prompt.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Prompt</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Prompt Content</label>
        <textarea
          className="w-full p-2 h-40 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {error && <p className="text-red-600 my-2">{error}</p>}

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Prompt
        </button>
      </form>
    </div>
  )
}

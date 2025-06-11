'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Prompt = {
  id: string
  title: string
  content: string
}

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])

  useEffect(() => {
    const fetchPrompts = async () => {
      const res = await fetch('/api/prompts')
      const data = await res.json()
      if (res.ok) setPrompts(data.prompts)
    }

    fetchPrompts()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Prompts</h1>
      {prompts.length === 0 ? (
        <p>No prompts yet. Create one!</p>
      ) : (
        <ul className="space-y-4">
          {prompts.map((prompt) => (
            <li key={prompt.id}>
              <Link href={`/prompts/${prompt.id}`}>
                <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
                  <h2 className="text-xl font-semibold">{prompt.title}</h2>
                  <p className="text-gray-600 line-clamp-2">{prompt.content}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

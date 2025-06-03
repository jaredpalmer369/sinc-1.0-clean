'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [prompts, setPrompts] = useState<
    { id: string; title: string | null; created_at: string }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user?.id) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPrompts(data)
      }
    }

    fetchData()
  }, [supabase, router])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Prompts</h1>

      {prompts.length === 0 ? (
        <p className="text-gray-500">No prompts found.</p>
      ) : (
        <ul className="space-y-4">
          {prompts.map((prompt) => (
            <li key={prompt.id} className="border p-4 rounded hover:shadow">
              <Link href={`/prompts/${prompt.id}`}>
                <div className="font-semibold text-lg">
                  {prompt.title || 'Untitled Prompt'}
                </div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(prompt.created_at).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

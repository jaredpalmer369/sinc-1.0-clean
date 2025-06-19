'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient<Database>()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null)
    })
  }, [])

  const handleSignout = async () => {
    await fetch('/signout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
      {userEmail && <p className="mb-2">Logged in as: {userEmail}</p>}

      <button
        onClick={handleSignout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </main>
  )
}

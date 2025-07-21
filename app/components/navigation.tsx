'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="text-xl font-bold">Sinc 1.0</div>
      <div className="space-x-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
        <Link href="/prompts/new" className="hover:text-gray-700">+ New Prompt</Link>
        {isLoggedIn && (
          <button
            onClick={handleSignOut}
            className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  )
}

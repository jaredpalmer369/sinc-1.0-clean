'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Welcome to Sinc</h1>
      <p className="text-lg md:text-xl text-center text-gray-300 mb-6 max-w-2xl">
        Your AI workforce. Real-time execution. Enterprise intelligence. Join the next generation of labor infrastructure.
      </p>

      <form className="w-full max-w-sm flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-grow px-4 py-2 rounded-lg text-black"
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Join Waitlist
        </button>
      </form>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/pricing')}
          className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition"
        >
          View Pricing
        </button>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-black transition"
        >
          Go to Dashboard
        </button>
      </div>
    </main>
  )
}

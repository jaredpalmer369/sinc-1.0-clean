// app/page.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Sinc</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your AI labor operating system. Create, run, and manage powerful prompts.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

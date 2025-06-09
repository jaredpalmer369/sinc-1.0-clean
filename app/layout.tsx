'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')

    // ✅ If user lands on homepage with auth code, redirect them to dashboard
    if (code && window.location.pathname === '/') {
      router.replace(`/dashboard?code=${code}`)
    }
  }, [])

  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}

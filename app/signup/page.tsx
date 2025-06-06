"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

console.log("🔥 Signup component loaded")

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🟢 Signup button clicked")
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://v0-sinc-1-0-qy.vercel.app/dashboard",
        data: { full_name: fullName },
      },
    })

    setLoading(false)

    if (error) {
      console.error("❌ Supabase signup error:", error)
      setError(error.message)
    } else {
      router.push("/login?message=Check your email to confirm your account")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <h1 className="text-xl font-bold text-blue-500 mb-6">🧪 SIGNUP PAGE RENDERED</h1>

      <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

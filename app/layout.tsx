import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center space-y-8 mt-24">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Synchronize your workflow.
        </h1>

        <p className="text-xl md:text-2xl text-gray-600">
          Sinc is your intelligent prompt OS.  
          Manage ideas, execute actions, and scale your productivity—fast.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/signup">
            <button className="px-6 py-3 rounded-xl bg-black text-white text-base font-semibold hover:bg-gray-900 transition">
              Get Started
            </button>
          </Link>

          <Link href="/login">
            <button className="text-base font-medium text-gray-600 hover:underline">
              Log In
            </button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Sinc AI. All rights reserved.
      </footer>
    </main>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

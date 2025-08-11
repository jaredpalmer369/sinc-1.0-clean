// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Sinq</h1>
        <nav className="flex gap-6 text-sm">
          <Link className="underline" href="/login">Log in</Link>
          <Link className="underline" href="/signup">Create account</Link>
        </nav>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Welcome to Sinq!</h2>
        <p className="text-neutral-700">
          Create, share, and iterate on prompts. Voice + marketplace coming online next.
        </p>
        <div className="flex gap-3">
          <Link href="/signup" className="rounded-xl px-4 py-2 bg-black text-white">Get started</Link>
          <Link href="/login" className="rounded-xl px-4 py-2 border">Log in</Link>
        </div>
      </section>

      <footer className="pt-12 text-sm text-neutral-500">
        By continuing you agree to our{" "}
        <a className="underline" href="/legal/terms">Terms</a> and{" "}
        <a className="underline" href="/legal/privacy">Privacy</a>.
      </footer>
    </main>
  );
}

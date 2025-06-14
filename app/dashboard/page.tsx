import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Your Prompts</h1>
      
      <Link
        href="/prompts/new"
        className="inline-block px-4 py-2 mb-6 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Create New Prompt
      </Link>

      {prompts && prompts.length > 0 ? (
        <ul className="space-y-4">
          {prompts.map((prompt) => (
            <li key={prompt.id} className="p-4 border rounded">
              <strong>{prompt.title}</strong>
              <p className="text-sm text-gray-600">{prompt.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No prompts yet. Create one!</p>
      )}
    </div>
  )
}

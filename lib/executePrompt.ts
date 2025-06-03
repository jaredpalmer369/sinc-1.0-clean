export async function executePrompt(prompt: string, promptId: string): Promise<string> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, promptId }),
  })

  const data = await res.json()
  if (res.ok) return data.result
  else throw new Error(data?.error || 'Prompt execution failed')
}

// This is a Server Component example
export default async function ServerExample() {
  // You can perform async operations here
  // This component will be rendered on the server
  const currentTime = new Date().toLocaleString()

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Server Component Example</h2>
      <p>This component was rendered on the server at: {currentTime}</p>
      <p className="mt-2">
        Server Components allow you to run code on the server, reducing the JavaScript sent to the client.
      </p>
    </div>
  )
}

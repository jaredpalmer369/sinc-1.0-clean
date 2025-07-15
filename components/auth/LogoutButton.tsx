'use client'

// import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  // const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Temporarily disable logout
      console.log('Logout temporarily disabled')
      
      // const { error } = await supabase.auth.signOut()
      // if (error) throw error
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout} 
      disabled={loading}
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
} 
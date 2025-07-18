'use client'

// import { createClient } from '@/lib/supabase'
// import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

interface UserContextType {
  user: any | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
})

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  // const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      // const { data: { session } } = await supabase.auth.getSession()
      // setUser(session?.user ?? null)
      setUser(null) // Temporarily set to null
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     setUser(session?.user ?? null)
    //     setLoading(false)
    //   }
    // )

    // return () => subscription.unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
} 
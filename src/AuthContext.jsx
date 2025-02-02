import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
      }

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setUser(session.user)
        }
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    signUp: async (data) => {
      const response = await supabase.auth.signUp(data)
      return response
    },
    signIn: async (data) => {
      const response = await supabase.auth.signInWithPassword(data)
      return response
    },
    signOut: async () => {
      const response = await supabase.auth.signOut()
      return response
    },
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from './supabaseClient.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      console.log('Getting initial session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
      }

      console.log('Initial session:', session)

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          console.log('Setting initial user:', session.user)
          setUser(session.user)
        }
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session)
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    signUp: async (data) => {
      console.log('Signing up...')
      const response = await supabase.auth.signUp(data)
      console.log('Sign up response:', response)
      return response
    },
    signIn: async (data) => {
      console.log('Signing in...')
      const response = await supabase.auth.signInWithPassword(data)
      console.log('Sign in response:', response)
      return response
    },
    signOut: async () => {
      console.log('Signing out...')
      const response = await supabase.auth.signOut()
      console.log('Sign out response:', response)
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
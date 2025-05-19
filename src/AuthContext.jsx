import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();

      const currentSession = data?.session;

      // only update the react state if the component is still mounted
      if (mounted) {
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);
        } else {
        }
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        setUser(newSession.user);
        setSession(newSession);
      } else {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to safely get the token
  const getToken = () => {
    if (session && session.access_token) {
      return session.access_token;
    }

    // Fallback method
    if (supabase.auth.session && supabase.auth.session.access_token) {
      return supabase.auth.session.access_token;
    }

    return null;
  };

  const value = {
    signUp: async (data) => {
      const response = await supabase.auth.signUp(data);
      return response;
    },
    signIn: async (data) => {
      const response = await supabase.auth.signInWithPassword(data);
      return response;
    },
    signOut: async () => {
      const response = await supabase.auth.signOut();
      return response;
    },
    user,
    session,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

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
      console.log("Getting initial session from Supabase");
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      }

      const currentSession = data?.session;
      console.log("Session retrieved:", currentSession ? "Yes" : "No");

      // only update the react state if the component is still mounted
      if (mounted) {
        if (currentSession) {
          console.log("User authenticated, setting user and session");
          console.log(
            "Session access token exists:",
            !!currentSession.access_token
          );
          setUser(currentSession.user);
          setSession(currentSession);
        } else {
          console.log("No active session found");
        }
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state change event:", _event);
      if (newSession) {
        console.log("New session available, updating auth context");
        setUser(newSession.user);
        setSession(newSession);
      } else {
        console.log("Session cleared, clearing auth context");
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
    console.log("getToken called");
    // First check if we have a session object
    if (session && session.access_token) {
      console.log("Returning access_token from session");
      return session.access_token;
    }

    // Fallback method
    if (supabase.auth.session && supabase.auth.session.access_token) {
      console.log("Falling back to supabase.auth.session access token");
      return supabase.auth.session.access_token;
    }

    console.log("No token found");
    return null;
  };

  const value = {
    signUp: async (data) => {
      console.log("Signing up with:", data.email);
      const response = await supabase.auth.signUp(data);
      console.log("Sign up response:", response);
      return response;
    },
    signIn: async (data) => {
      console.log("Signing in with:", data.email);
      const response = await supabase.auth.signInWithPassword(data);
      console.log("Sign in successful:", !!response.data.session);
      return response;
    },
    signOut: async () => {
      console.log("Signing out");
      const response = await supabase.auth.signOut();
      console.log("Sign out complete");
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

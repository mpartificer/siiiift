import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient.js";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

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

  // Fetch user details from your API
  const fetchUserDetails = async (userId, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await axios.get(`${API_URL}/users/${userId}/`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn("API request failed:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();
      const currentSession = data?.session;

      if (mounted) {
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);

          // Create fallback user details immediately
          const fallbackDetails = {
            user_auth_id: currentSession.user.id,
            username: currentSession.user.email
              ? currentSession.user.email.split("@")[0]
              : "user",
            email: currentSession.user.email || "unknown",
          };
          setUserDetails(fallbackDetails);

          // Try to fetch enhanced details from API
          const token = currentSession.access_token;
          if (token) {
            const apiDetails = await fetchUserDetails(
              currentSession.user.id,
              token
            );
            if (mounted && apiDetails) {
              setUserDetails(apiDetails);
            }
          }
        }
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        if (newSession) {
          setUser(newSession.user);
          setSession(newSession);

          // Create fallback user details immediately
          const fallbackDetails = {
            user_auth_id: newSession.user.id,
            username: newSession.user.email
              ? newSession.user.email.split("@")[0]
              : "user",
            email: newSession.user.email || "unknown",
          };
          setUserDetails(fallbackDetails);

          // Try to fetch enhanced details from API
          const token = newSession.access_token;
          if (token) {
            const apiDetails = await fetchUserDetails(
              newSession.user.id,
              token
            );
            if (mounted && apiDetails) {
              setUserDetails(apiDetails);
            }
          }
        } else {
          setUser(null);
          setSession(null);
          setUserDetails(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [API_URL]);

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
    userDetails,
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

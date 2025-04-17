import { House, Search, Plus, BookOpen, User } from "lucide-react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function Footer() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const API_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

  // Debug information
  console.log("Footer component rendered");

  useEffect(() => {
    console.log("Footer useEffect triggered");
    let isMounted = true;

    async function fetchUserDetails() {
      console.log("Fetching user details...");

      if (!isMounted) {
        console.log("Component unmounted, aborting fetch");
        return;
      }

      try {
        // First get the authenticated user from Supabase
        console.log("Getting user from Supabase");
        const authResponse = await supabase.auth.getUser();
        console.log("Supabase auth response:", authResponse);

        const user = authResponse.data.user;

        if (!user) {
          console.log("No user found in Supabase");
          if (isMounted) {
            setError("No authenticated user found");
            setIsLoading(false);
          }
          return;
        }

        console.log("User found in Supabase:", user.id);
        const userId = user.id;

        // Set basic user details from Supabase immediately so we have something to work with
        // This serves as a fallback if the API call fails
        setUserDetails({
          user_auth_id: userId,
          username: user.email ? user.email.split("@")[0] : "user", // Fallback username from email
          email: user.email || "unknown",
          // Add any other fields your app requires
        });

        // Get token for API request
        console.log("Getting auth token");
        const token = getToken();
        console.log("Token retrieved:", token ? "Yes" : "No");

        if (!token) {
          console.log("No valid token found");
          if (isMounted) {
            setError("Your session has expired. Please log in again.");
            setIsLoading(false);
          }
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        // Use the API endpoint to get user profile
        console.log(`Making API request to ${API_URL}/users/${userId}/`);

        // Set a timeout for the API request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await axios.get(`${API_URL}/users/${userId}/`, {
            ...config,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          console.log("API response:", response.data);

          if (isMounted) {
            if (response.data && response.data.success) {
              console.log("Setting user details from API:", response.data.data);
              setUserDetails(response.data.data);
            }
          }
        } catch (apiError) {
          clearTimeout(timeoutId);
          console.warn(
            "API request failed, using fallback user details:",
            apiError
          );
          // We already set basic user details above, so we can continue
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserDetails:", error);
        if (isMounted) {
          setError(
            error.message || "An error occurred while fetching user data"
          );
          setIsLoading(false);
        }
      }
    }

    fetchUserDetails();

    return () => {
      console.log("Footer component cleanup");
      isMounted = false;
    };
  }, [getToken, API_URL]);

  // Add fallback for loading state that's been active too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout occurred");
        setIsLoading(false);
        // Don't set an error if we have fallback user details
        if (!userDetails) {
          setError("Loading timed out. Navigation is still available.");
        }
      }
    }, 5000); // Reduced to 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [isLoading, userDetails]);

  console.log("Current component state:", {
    isLoading,
    error,
    userDetailsExists: !!userDetails,
  });

  // If still loading, render an invisible placeholder to maintain layout but show nothing
  if (isLoading) return <div className="btm-nav invisible"></div>;

  // Even if there's an error, if we have userDetails (from fallback), render the footer
  if (error && !userDetails) {
    console.log("Error condition but proceeding with footer rendering");
    // Instead of showing error, render the footer with limited functionality
    return (
      <div className="btm-nav footerBackground z-50">
        <button className="navIcons" onClick={() => navigate("/")}>
          <House size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons" onClick={() => navigate("/search")}>
          <Search size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons" onClick={() => navigate("/postyourbake")}>
          <Plus size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons">
          <BookOpen size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons">
          <User size={36} color="#FAE2D5" />
        </button>
      </div>
    );
  }

  const userName = userDetails.username;
  const userId = userDetails.user_auth_id;

  // Create user data object for navigation
  const userData = { userName: userName, userId: userId };
  console.log("Navigation userData:", userData);

  const toUserProfile = () => {
    console.log("Navigating to profile");
    navigate(`/profile/${userName}`, { state: userData });
  };

  const toUserRecipeBox = () => {
    console.log("Navigating to recipe box");
    navigate("/recipebox", { state: userData });
  };

  const toSearch = () => {
    console.log("Navigating to search");
    navigate("/search", { state: userData });
  };

  // Render the footer navigation
  console.log("Rendering footer navigation");

  return (
    <div className="btm-nav footerBackground z-50">
      <button className="navIcons" onClick={() => navigate("/")}>
        <House size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toSearch}>
        <Search size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={() => navigate("/postyourbake")}>
        <Plus size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toUserRecipeBox}>
        <BookOpen size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toUserProfile}>
        <User size={36} color="#FAE2D5" />
      </button>
    </div>
  );
}

export default Footer;

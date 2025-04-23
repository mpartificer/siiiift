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

  useEffect(() => {
    let isMounted = true;

    async function fetchUserDetails() {
      if (!isMounted) {
        return;
      }

      try {
        const authResponse = await supabase.auth.getUser();

        const user = authResponse.data.user;

        if (!user) {
          if (isMounted) {
            setError("No authenticated user found");
            setIsLoading(false);
          }
          return;
        }

        const userId = user.id;

        setUserDetails({
          user_auth_id: userId,
          username: user.email ? user.email.split("@")[0] : "user", // Fallback username from email
          email: user.email || "unknown",
        });

        const token = getToken();

        if (!token) {
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await axios.get(`${API_URL}/users/${userId}/`, {
            ...config,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          if (isMounted) {
            if (response.data && response.data.success) {
              setUserDetails(response.data.data);
            }
          }
        } catch (apiError) {
          clearTimeout(timeoutId);
          console.warn(
            "API request failed, using fallback user details:",
            apiError
          );
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
      isMounted = false;
    };
  }, [getToken, API_URL]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        if (!userDetails) {
          setError("Loading timed out. Navigation is still available.");
        }
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, userDetails]);

  if (isLoading) return <div className="btm-nav invisible"></div>;

  if (error && !userDetails) {
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

  const userData = { userName: userName, userId: userId };

  const toUserProfile = () => {
    navigate(`/profile/${userName}`, { state: userData });
  };

  const toUserRecipeBox = () => {
    navigate("/recipebox", { state: userData });
  };

  const toSearch = () => {
    navigate("/search", { state: userData });
  };

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

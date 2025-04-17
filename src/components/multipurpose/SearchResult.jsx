import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Book } from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import axios from "axios"; // Import axios for API calls

function SearchResult({
  currentUserId,
  searchReturnValue,
  type,
  imageUrl,
  userId,
  recipeId,
}) {
  const [isFollowingOrSaved, setIsFollowingOrSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth(); // Get the auth token

  // Base API URL - should come from environment variable or config
  const API_BASE_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

  // Use the correct ID based on type
  const relevantId = type === "user" ? userId : recipeId;

  useEffect(() => {
    // Only check status if we have the necessary IDs
    if (currentUserId && relevantId) {
      console.log(
        `Checking status on mount/update: type=${type}, currentUser=${currentUserId}, relevantId=${relevantId}`
      );
      checkStatus();
    } else {
      console.warn(
        `Missing required IDs for status check: currentUserId=${currentUserId}, relevantId=${relevantId}, type=${type}`
      );
    }
  }, [currentUserId, relevantId, type]);

  async function checkStatus() {
    setIsLoading(true);
    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token missing");
      }

      if (type === "user") {
        console.log(
          `Checking follow status: follower=${currentUserId}, following=${userId}`
        );

        if (!currentUserId || !userId) {
          console.error("Missing IDs for check:", { currentUserId, userId });
          throw new Error("Missing user IDs for status check");
        }

        const response = await axios.get(
          `${API_BASE_URL}/users/${currentUserId}/following/check/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Follow status response:", response.data);
        setIsFollowingOrSaved(response.data.isFollowing);
      } else if (type === "recipe") {
        console.log(
          `Checking save status: user=${currentUserId}, recipe=${recipeId}`
        );

        if (!currentUserId || !recipeId) {
          console.error("Missing IDs for check:", { currentUserId, recipeId });
          throw new Error("Missing IDs for status check");
        }

        const response = await axios.get(
          `${API_BASE_URL}/recipes/${recipeId}/saves/check/${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Save status response:", response.data);
        setIsFollowingOrSaved(response.data.isSaved);
      }
    } catch (error) {
      console.error(
        "Error checking status:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.error || "Failed to check status");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleAction() {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token missing");
      }

      if (type === "user") {
        console.log(
          `Toggling follow: followerId=${currentUserId}, followingId=${userId}`
        );

        if (!currentUserId || !userId) {
          console.error("Missing IDs for toggle action:", {
            currentUserId,
            userId,
          });
          throw new Error("Missing user IDs for toggle action");
        }

        const response = await axios.post(
          `${API_BASE_URL}/users/follow/toggle`,
          {
            followerId: currentUserId,
            followingId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Follow toggle response:", response.data);
        setIsFollowingOrSaved(response.data.isFollowing);
      } else if (type === "recipe") {
        console.log(
          `Toggling save: userId=${currentUserId}, recipeId=${recipeId}`
        );

        if (!currentUserId || !recipeId) {
          console.error("Missing IDs for toggle action:", {
            currentUserId,
            recipeId,
          });
          throw new Error("Missing IDs for toggle action");
        }

        const response = await axios.post(
          `${API_BASE_URL}/recipes/${recipeId}/saves/toggle`,
          {
            userId: currentUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Save toggle response:", response.data);
        setIsFollowingOrSaved(response.data.isSaved);
      }
    } catch (error) {
      console.error(
        "Error toggling status:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.error || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  }

  function getButtonText() {
    if (isLoading) return "Loading...";
    if (type === "user") return isFollowingOrSaved ? "unfollow" : "follow";
    if (type === "recipe") return isFollowingOrSaved ? "unsave" : "save";
    return "Action";
  }

  // Don't render if missing critical props
  if ((type === "user" && !userId) || (type === "recipe" && !recipeId)) {
    console.warn(`SearchResult missing required ID for type ${type}`);
    return null;
  }

  return (
    <div className="searchResult w-350 md:w-96">
      <Link
        to={
          type === "user"
            ? `/profile/${searchReturnValue}`
            : `/recipe/${recipeId}`
        }
        state={type === "user" ? { userId: userId } : { recipeId: recipeId }}
        className="searchDetail hover:bg-primary hover:text-secondary transition-colors"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={type === "user" ? "Profile photo" : "Recipe image"}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : type === "user" ? (
          <User size={50} color="#EBD2AD" />
        ) : (
          <Book size={50} color="#EBD2AD" />
        )}
        <div className="ml-2 mr-2">
          {searchReturnValue ||
            (type === "user" ? "Unknown User" : "Unknown Recipe")}
        </div>
      </Link>
      {currentUserId && (
        <button
          className="searchResultButton"
          onClick={toggleAction}
          disabled={isLoading}
        >
          {getButtonText()}
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SearchResult;

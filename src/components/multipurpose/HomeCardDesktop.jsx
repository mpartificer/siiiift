import React, { useState, useEffect } from "react";
import { Heart, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTitle from "./PageTitle.jsx";
import { useAuth } from "../../AuthContext";
import "../../App.css";

function PostReactionBox({
  currentUserId,
  username,
  recipeId,
  userId,
  bakeId,
}) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { getToken } = useAuth();

  useEffect(() => {
    if (currentUserId && bakeId) {
      // Only check if we have both values
      checkLikeStatus();
      fetchLikeCount();
    }
  }, [currentUserId, bakeId]); // Re-run when either of these change

  const checkLikeStatus = async () => {
    if (!currentUserId || !bakeId) return; // Guard clause

    try {
      const token = getToken();
      const apiUrl =
        import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";
      const response = await fetch(
        `${apiUrl}/engagement/like/check/${currentUserId}/${bakeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(`Failed to check like status: ${response.status}`);
      }

      const data = await response.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const fetchLikeCount = async () => {
    if (!bakeId) return;

    try {
      const token = getToken();
      const apiUrl =
        import.meta.env.VITE_APP_API_URL || "http://localhost:808/api";
      const response = await fetch(
        `${apiUrl}/engagement/like/count/${bakeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(`Failed to fetch like count: ${response.status}`);
      }

      const data = await response.json();
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const toggleLike = async () => {
    if (!currentUserId || !bakeId) return; // Guard clause

    try {
      const token = getToken();
      // Use the correct API URL - assuming your backend runs on port 8080 or whatever you've set in .env
      const apiUrl =
        import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${apiUrl}/engagement/like/${bakeId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          recipeId: recipeId,
          bakeId: bakeId, // Adding bakeId to the request body
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        throw new Error(`Failed to toggle like: ${response.status}`);
      }

      const result = await response.json();
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const bakeData = { userId: userId, recipeId: recipeId, username: username };

  const toBakeProfile = () => {
    navigate(`/${username}/${recipeId}`, { state: bakeData });
  };

  return (
    <div className="postReactionBox mt-1 ml-2.5">
      <Heart
        size={40}
        color={isLiked ? "palevioletred" : "#496354"}
        fill={isLiked ? "palevioletred" : "none"}
        onClick={toggleLike}
        style={{ cursor: "pointer" }}
      />
      <Lightbulb
        size={39}
        color="#496354"
        onClick={toBakeProfile}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

function HomeCardDesktop(props) {
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  if (authError) {
    console.error("Authentication error:", authError);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="homeCard standardBorder border-2 m-2 bg-secondary border-primary p-2 flex flex-row w-fit justify-center">
        {props.photos && (
          <img src={props.photos} alt="recipe" className="recipeImg ml-2.5" />
        )}
        <div className="flex flex-col mr-2.5 w-80">
          <PageTitle
            pageTitle={[props.username, props.recipeTitle]}
            path={[`/profile/${props.username}`, `/recipe/${props.recipeId}`]}
            userId={props.userId}
            recipeId={props.recipeId}
          />
          <PostReactionBox
            username={props.username}
            recipeId={props.recipeId}
            currentUserId={currentUserId}
            bakeId={props.bakeId}
            userId={props.userId}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeCardDesktop;

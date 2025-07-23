import React, { useState, useEffect } from "react";
import "../App.css";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import { useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";
import { supabase } from "../supabaseClient.js";

function DateMarker({ date }) {
  return (
    <div className="bg-primary font-bold text-neutral overflow-hidden standardBorder w-fit pt-1 pb-1 pr-4 pl-4">
      {new Date(date)
        .toLocaleDateString("en-US", { year: "numeric", month: "long" })
        .toLowerCase()}
    </div>
  );
}

function ModInsert({ detail }) {
  return (
    <div>
      <div className="line-through">{detail.original_step_text}</div>
      <div className="text-right font-bold">{detail.updated_step}</div>
    </div>
  );
}

function ModDetailInsert(props) {
  const modDetails = props.modDetails;
  return (
    <div>
      <h2 className="font-bold">{props.title}</h2>
      {modDetails.map((detail, index) => (
        <ModInsert key={index} detail={detail} />
      ))}
    </div>
  );
}

function BakeDetailInsert({ title, description }) {
  return (
    <div>
      <h2 className="font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function BakeHistoryCard({
  bakeDetail,
  likeDetails,
  modDetails,
  currentUserDetails,
  onLikeToggle,
}) {
  // Ensure we have arrays even if null/undefined is passed
  const safeModDetails = Array.isArray(modDetails) ? modDetails : [];
  const safeLikeDetails = Array.isArray(likeDetails) ? likeDetails : [];

  // Filter modifications for this specific bake
  const mods = bakeDetail?.id
    ? safeModDetails.filter((mod) => mod.bake_id === bakeDetail.id)
    : [];

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Debug logging on mount
  useEffect(() => {
    // Get the user auth ID from the currentUserDetails, checking both possible field names
    const userAuthId =
      currentUserDetails?.data?.user?.user_auth_id ||
      currentUserDetails?.data?.user?.id;

    setIsUserLoggedIn(!!userAuthId);

    console.log(`BakeHistoryCard for bake ${bakeDetail?.id || "unknown"}:`);
    console.log(`- User auth ID: ${userAuthId || "not found"}`);
    console.log(`- User logged in: ${!!userAuthId}`);
    console.log(`- Bake has ID: ${!!bakeDetail?.id}`);

    // Log the bake detail info
    if (bakeDetail) {
      console.log("Bake detail:", {
        id: bakeDetail.id,
        like_count: bakeDetail.like_count,
        has_like_count: "like_count" in bakeDetail,
      });
    }
  }, [currentUserDetails, bakeDetail]);

  // Initialize and fetch the like count
  useEffect(() => {
    if (!bakeDetail?.id) return;

    // Start with a default value
    let initialCount = 0;

    // Use the pre-computed like_count if available
    if (typeof bakeDetail.like_count === "number") {
      console.log(`Using pre-computed like_count: ${bakeDetail.like_count}`);
      initialCount = bakeDetail.like_count;
    } else {
      // Count from likeDetails array as fallback
      const likesForThisBake = safeLikeDetails.filter(
        (like) => like.bake_id === bakeDetail.id
      );
      console.log(
        `Computed like count from likeDetails: ${likesForThisBake.length}`
      );
      initialCount = likesForThisBake.length;
    }

    // Set the initial count
    setLikeCount(initialCount);
    console.log(`Initially setting like count to: ${initialCount}`);

    // Always fetch the latest count from the API to be sure
    fetchLikeCount();
  }, [bakeDetail?.id, safeLikeDetails]);

  // Fetch like count from API
  const fetchLikeCount = async () => {
    if (!bakeDetail?.id) {
      console.log("Cannot fetch like count: No bake ID available");
      return;
    }

    try {
      console.log(`Fetching like count for bake ${bakeDetail.id}`);
      const response = await axios.get(
        `/engagement/like/count/${bakeDetail.id}`
      );

      if (response.data && typeof response.data.likeCount === "number") {
        console.log(`API returned like count: ${response.data.likeCount}`);
        setLikeCount(response.data.likeCount);
      } else {
        console.warn("API did not return a valid like count:", response.data);
      }
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  // Check if current user has liked this bake
  useEffect(() => {
    if (isUserLoggedIn && bakeDetail?.id) {
      checkLikeStatus();
    }
  }, [isUserLoggedIn, bakeDetail?.id]);

  const checkLikeStatus = async () => {
    // Get the user auth ID, checking both possible field names
    const userAuthId =
      currentUserDetails?.data?.user?.user_auth_id ||
      currentUserDetails?.data?.user?.id;

    if (!userAuthId || !bakeDetail?.id) {
      console.log("Cannot check like status: Missing user auth ID or bake ID");
      return;
    }

    try {
      console.log(
        `Checking like status for user ${userAuthId} and bake ${bakeDetail.id}`
      );
      const response = await axios.get(
        `/engagement/like/check/${userAuthId}/${bakeDetail.id}`
      );
      console.log(`Like status from API: ${response.data.isLiked}`);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error checking like status:", error);
      setIsLiked(false);
    }
  };

  const toggleLike = async () => {
    // Get the user auth ID, checking both possible field names
    const userAuthId =
      currentUserDetails?.data?.user?.user_auth_id ||
      currentUserDetails?.data?.user?.id;

    if (!userAuthId) {
      console.log("Cannot toggle like: User not logged in");
      return;
    }

    if (!bakeDetail?.id) {
      console.log("Cannot toggle like: Missing bake ID");
      return;
    }

    setIsLikeLoading(true);

    try {
      console.log(
        `Toggling like for bake ${bakeDetail.id} by user ${userAuthId}`
      );
      const response = await axios.post(`/engagement/like/${bakeDetail.id}`, {
        userId: userAuthId,
        recipeId: bakeDetail.recipe_id,
      });

      console.log(`Toggle like response:`, response.data);

      // Make sure we're getting and using the correct values from the response
      if (response.data) {
        if (typeof response.data.isLiked === "boolean") {
          setIsLiked(response.data.isLiked);
        }

        if (typeof response.data.likeCount === "number") {
          console.log(
            `Setting like count to ${response.data.likeCount} after toggle`
          );
          setLikeCount(response.data.likeCount);
        }
      }

      if (onLikeToggle) {
        onLikeToggle(bakeDetail.id, response.data.isLiked);
      }

      // Fetch the latest count to be sure
      fetchLikeCount();
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Ensure we have valid data before rendering
  if (!bakeDetail) {
    return <div>Missing bake details</div>;
  }

  return (
    <div className="recipeCheckPanel border-2 w-350 border-primary md:w-4/5 mx-auto bg-secondary p-4 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4 md:h-fit">
        {/* Left column - Date and Photo (sets the height on desktop) */}
        <div className="md:w-1/2 md:flex-shrink-0">
          <DateMarker date={bakeDetail.baked_at} />
          <div className="h-96 mt-2">
            <img
              src={bakeDetail.photos?.[0] || "/src/assets/TempImage.jpg"}
              alt="recipe image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right column - Content that matches left column height and scrolls */}
        <div className="md:w-1/2 md:flex md:flex-col md:h-[calc(theme(spacing.96)+theme(spacing.2)+2.5rem)]">
          {/* Like section - fixed at top */}
          <div className="flex items-center gap-2 mb-4 md:flex-shrink-0">
            <Heart
              size={30}
              color={isLiked ? "palevioletred" : "#496354"}
              fill={isLiked ? "palevioletred" : "none"}
              onClick={isUserLoggedIn && !isLikeLoading ? toggleLike : null}
              style={{
                cursor:
                  isUserLoggedIn && !isLikeLoading ? "pointer" : "default",
                opacity: isUserLoggedIn ? 1 : 0.6,
              }}
            />
            <span className="font-bold text-lg">
              {likeCount !== undefined ? likeCount : 0}
            </span>
            {!isUserLoggedIn && (
              <span className="text-sm text-gray-500 ml-2">
                (log in to like)
              </span>
            )}
          </div>

          {/* Scrollable content area */}
          <div className="md:flex-1 md:overflow-y-auto md:pr-2">
            {mods && mods.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">modifications</h2>
                {mods.map((detail, index) => (
                  <div key={index} className="mb-2">
                    <div className="line-through text-gray-500">
                      {detail.original_step_text}
                    </div>
                    <div className="text-right font-bold">
                      {detail.updated_step}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h2 className="font-bold text-lg mb-2">ai insights</h2>
              <p>{bakeDetail.ai_insights}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BakeHistoryView() {
  const { username, recipeid } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [bakeDetails, setBakeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeDetails, setLikeDetails] = useState([]);
  const [currentUserDetails, setCurrentUserDetails] = useState([]);
  const [modificationDetails, setModificationDetails] = useState([]);
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching auth session:", error);
          setError("Failed to check authentication status");
          setAuthChecked(true);
          return;
        }

        console.log("Auth session check result:", data);
        setSession(data.session);
        setAuthChecked(true);

        if (!data.session) {
          console.warn("No active session found");
          // You could show a message to the user about logging in
        }
      } catch (err) {
        console.error("Exception during auth check:", err);
        setError("Failed to check authentication status");
        setAuthChecked(true);
      }
    }

    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";
    axios.defaults.withCredentials = true;

    // Set up a request interceptor to add the auth token to all requests
    const interceptor = axios.interceptors.request.use(
      function (config) {
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
          console.log("Added auth token to request");
        } else {
          console.warn("No auth token available for request");
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up the interceptor when the component unmounts
      axios.interceptors.request.eject(interceptor);
    };
  }, [session]);

  // Fetch bake details once we've checked auth
  useEffect(() => {
    async function fetchBakeDetails() {
      if (!authChecked) {
        return; // Wait until auth check is complete
      }

      if (!username || !recipeid) {
        setError("Missing required parameters");
        setIsLoading(false);
        return;
      }

      try {
        console.log(
          `Fetching bake history for ${username} and recipe ${recipeid}`
        );
        console.log(
          "Current session:",
          session ? "Available" : "Not available"
        );

        // The token will be added by the axios interceptor
        const response = await axios.get(
          `/bakes/history/${username}/${recipeid}`
        );
        const data = response.data;

        console.log("Bake history data received:", {
          profileData: data.profileData,
          bakeCount: data.bakeDetails?.length,
          likeCount: data.likeDetails?.length,
          modCount: data.modificationDetails?.length,
        });

        setProfileData(data.profileData);
        setBakeDetails(data.bakeDetails || []);
        setLikeDetails(data.likeDetails || []);
        setModificationDetails(data.modificationDetails || []);
        setCurrentUserDetails(
          data.currentUserDetails || { data: { user: {} } }
        );
      } catch (error) {
        console.error("Error fetching bake history:", error);

        if (error.response?.status === 401) {
          setError("Authentication required. Please log in.");
          // You could handle redirection to login here
        } else {
          setError(error.response?.data?.error || error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchBakeDetails();
  }, [username, recipeid, authChecked, session]);

  // Handle like toggle with proper authentication
  const handleLikeToggle = (bakeId, isLiked) => {
    if (!session) {
      console.warn("Cannot toggle like: Not authenticated");
      // You might want to prompt the user to login here
      return;
    }

    setLikeDetails((prevLikes) => {
      const userId = currentUserDetails?.data?.user?.id;

      if (!userId) return prevLikes;

      if (isLiked) {
        return [...prevLikes, { bake_id: bakeId, user_id: userId }];
      } else {
        return prevLikes.filter(
          (like) => !(like.bake_id === bakeId && like.user_id === userId)
        );
      }
    });
  };

  // Your render method remains the same
  if (isLoading) {
    return (
      <HeaderFooter>
        <div className="container mx-auto px-4 mt-16">
          <div>Loading...</div>
        </div>
      </HeaderFooter>
    );
  }

  if (error) {
    return (
      <HeaderFooter>
        <div className="container mx-auto px-4 mt-16">
          <div>Error: {error}</div>
        </div>
      </HeaderFooter>
    );
  }

  if (!bakeDetails || bakeDetails.length === 0) {
    return (
      <HeaderFooter>
        <div className="container mx-auto px-4 mt-16">
          <div>No bakes found for this recipe</div>
        </div>
      </HeaderFooter>
    );
  }

  return (
    <div>
      <HeaderFooter>
        <div className="container mx-auto px-4 mt-20 mb-20 flex flex-col items-center">
          <div className="text-xl text-primary mb-2">
            <Link
              to={`/profile/${profileData.username}`}
              state={{ userId: profileData.user_auth_id }}
              className="text-primary hover:underline"
            >
              {profileData.username}
            </Link>
            's{" "}
            <Link
              to={`/recipe/${recipeid}`}
              state={{ recipeId: recipeid }}
              className="text-primary hover:underline"
            >
              {bakeDetails[0]?.recipe_title}
            </Link>{" "}
            history
          </div>
          <div className="space-y-6">
            {bakeDetails.map((detail) => (
              <BakeHistoryCard
                key={detail.id}
                bakeDetail={detail}
                likeDetails={likeDetails}
                modDetails={modificationDetails}
                currentUserDetails={currentUserDetails}
                onLikeToggle={handleLikeToggle}
              />
            ))}
          </div>
        </div>
      </HeaderFooter>
    </div>
  );
}

export default BakeHistoryView;

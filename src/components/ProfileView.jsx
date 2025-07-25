import FollowBar from "../components/multipurpose/FollowBar.jsx";
import FollowTab from "../components/multipurpose/FollowTab.jsx";
import { Settings } from "lucide-react";
import { Cookie } from "lucide-react";
import { BookOpen } from "lucide-react";
import HeaderFooter from "../components/multipurpose/HeaderFooter.jsx";
import { useNavigate } from "react-router-dom";
import "../App.css";
import HomeCardMobile from "./multipurpose/HomeCardMobile.jsx";
import RecipeCardProfile from "./multipurpose/RecipeCardProfile.jsx";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";

// API base URL - ideally from environment variable
const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

function SettingsButton(props) {
  const navigate = useNavigate();

  const userData = { userId: props.userId };

  const toUserSettings = () => {
    navigate(`/profile/settings`, { state: userData });
  };

  return (
    <div className="settingsButton">
      <Settings size={24} color="#192F01" onClick={toUserSettings} />
    </div>
  );
}

function ProfileBlurb(props) {
  return (
    <div className="profileBlurb overflow-y-scroll">
      {props.profileDescription}
    </div>
  );
}

function ProfileSummary(props) {
  return (
    <div className="profileSummary md:w-full md:flex-1">
      <FollowBar>
        <FollowTab
          number={props.followerCount}
          measure="followers"
          username={props.username}
          userId={props.userId}
        />
        <FollowTab
          number={props.followingCount}
          measure="following"
          username={props.username}
          userId={props.userId}
        />
        <FollowTab
          number={props.bakes}
          measure="bakes"
          username={props.username}
          userId={props.userId}
        />
      </FollowBar>
      <ProfileBlurb profileDescription={props.userBio} />
    </div>
  );
}

function ProfilePlateTop(props) {
  return (
    <div className="profilePlateTop text-xl w-350 pr-0.5 pl-0.5 justify-between">
      {props.children}
    </div>
  );
}

function ProfilePlateBottom(props) {
  return (
    <div className="flex flex-row md:flex-col flex-nowrap md:flex-wrap gap-2 md:items-end w-350 justify-center md:justify-end mb-2">
      {props.children}
    </div>
  );
}

function ProfilePlateMobile(props) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center gap-2 mb-1 w-full max-w-sm mx-auto">
      <ProfilePlateTop className="w-full flex content-between items-center px-4">
        <div className="pageTitle text-xl">{props.userName}</div>
        {currentUserId === props.userId && (
          <SettingsButton userId={props.userId} />
        )}
      </ProfilePlateTop>
      <ProfilePlateBottom className="flex flex-col items-center w-full px-4 gap-4 flex-1">
        <img
          src={props.photos}
          alt="recipe"
          className="w-24 h-24 md:w-80 md:h-80 object-cover standardBorder"
        />
        <ProfileSummary
          bakes={props.bakes}
          followingCount={props.followingCount}
          followerCount={props.followerCount}
          username={props.userName}
          userId={props.userId}
          userBio={props.userBio}
        />
      </ProfilePlateBottom>
    </div>
  );
}

function ProfilePlateDesktop(props) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  return (
    <div className="profilePlate sm:w-350 items-end">
      <ProfilePlateTop>
        <div className="pageTitle text-xl">{props.userName}</div>
        {currentUserId === props.userId && (
          <SettingsButton userId={props.userId} />
        )}
      </ProfilePlateTop>
      <ProfilePlateBottom>
        <img
          src={props.photos}
          alt="recipe"
          className="sm:min-w-36 sm:min-h-36 md:min-w-80 md:min-h-80 object-cover standardBorder recipeImg"
        />
        <ProfileSummary
          bakes={props.bakes}
          followingCount={props.followingCount}
          followerCount={props.followerCount}
          username={props.userName}
          userId={props.userId}
          userBio={props.userBio}
        />
      </ProfilePlateBottom>
    </div>
  );
}

function ContentCap({ userId }) {
  const [activeTab, setActiveTab] = useState("bakes");
  const [bakes, setBakes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { session } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getCurrentUser();

    if (userId) {
      fetchBakes();
      fetchSavedRecipes();
    }
  }, [userId, session]);

  const fetchBakes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bakes/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bakes");
      }

      const data = await response.json();
      if (data.success) {
        setBakes(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bakes:", error);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/saves/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved recipes");
      }

      const data = await response.json();
      if (data) {
        setSavedRecipes(data || []);
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  const contentClass =
    windowWidth > 768 ? "flex-1 overflow-y-auto mt-2" : "mt-2";

  return (
    <div
      className={
        windowWidth > 768
          ? "h-full flex flex-col"
          : "flex flex-col items-center"
      }
    >
      <div className="flex justify-center w-full">
        <ul className="menu menu-horizontal bg-primary rounded-box w-350 justify-around">
          <li>
            <a
              className={`tooltip tooltip-bottom ${
                activeTab === "bakes" ? "active" : ""
              }`}
              data-tip="bakes"
              onClick={() => setActiveTab("bakes")}
            >
              <Cookie />
            </a>
          </li>
          <li>
            <a
              className={`tooltip tooltip-bottom ${
                activeTab === "recipes" ? "active" : ""
              }`}
              data-tip="saved recipes"
              onClick={() => setActiveTab("recipes")}
            >
              <BookOpen />
            </a>
          </li>
        </ul>
      </div>
      <div className={contentClass}>
        {activeTab === "bakes" && (
          <div className="grid grid-cols-1">
            {bakes.map((bake) => (
              <HomeCardMobile
                key={bake.bake_id}
                username={bake.username}
                recipeTitle={bake.recipe_title}
                photos={bake.photos}
                recipeId={bake.recipe_id}
                currentUserId={currentUserId}
                bakeId={bake.bake_id}
                userId={bake.user_id}
              />
            ))}
          </div>
        )}
        {activeTab === "recipes" && (
          <div className="grid grid-cols-1 gap-0">
            {savedRecipes.map((recipe) => (
              <RecipeCardProfile
                key={recipe.recipe_id}
                recipeTitle={recipe.recipe_title}
                recipeId={recipe.recipe_id}
                photo={recipe.recipe_images}
                totalTime={recipe.total_time}
                extraClass="w-350"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileView() {
  const location = useLocation();
  const userId = location.state.userId;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { session } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (userId && session) {
      fetchUserDetails();
    }
  }, [userId, session]);

  const fetchUserDetails = async () => {
    try {
      // Fetch user profile from backend
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const result = await response.json();

      if (result.success) {
        setUserDetails(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch user details");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  return (
    <div className="flex flex-col overflow-hidden content-center justify-center">
      <HeaderFooter>
        {windowWidth > 768 ? (
          <div className="flex flex-col items-center overflow-hidden">
            <div className="flex flex-row mt-16 mb-16 w-full max-w-7xl justify-center content-center">
              <div className="flex flex-row justify-center gap-2">
                <ProfilePlateDesktop
                  userName={userDetails.username}
                  followerCount={userDetails.followerCount}
                  followingCount={userDetails.followingCount}
                  userBio={userDetails.bio}
                  bakes={userDetails.bakesCount}
                  recipes={userDetails.recipes_count}
                  userId={userId}
                  photos={userDetails.photo}
                />
                <div className="h-[calc(100vh-8rem)] overflow-hidden">
                  <ContentCap userId={userId} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-wrap mt-16 mb-16 justify-center items-center">
            <ProfilePlateMobile
              userName={userDetails.username}
              followerCount={userDetails.followerCount}
              followingCount={userDetails.followingCount}
              userBio={userDetails.bio}
              bakes={userDetails.bakesCount}
              recipes={userDetails.recipes_count}
              userId={userId}
              photos={userDetails.photo}
            />
            <ContentCap userId={userId} />
          </div>
        )}
      </HeaderFooter>
    </div>
  );
}

export default ProfileView;

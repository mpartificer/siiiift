import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./multipurpose/Header.jsx";
import FollowBar from "./multipurpose/FollowBar.jsx";
import FollowTab from "./multipurpose/FollowTab.jsx";
import SearchBar from "./multipurpose/SearchBar.jsx";
import SearchResult from "./multipurpose/SearchResult.jsx";
import Footer from "./multipurpose/Footer.jsx";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";

function FollowersView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userName, measure } = location?.state || {};
  const { user } = useAuth();

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [bakesCount, setBakesCount] = useState(0);

  const API_BASE_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        setError("No userId provided");
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.error("No authenticated user");
        setError("You need to be logged in to view this page");
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
          console.error("No auth token available");
          setError("Your session has expired. Please log in again.");
          setIsLoading(false);
          return;
        }

        console.log("Found valid auth token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        console.log(`Fetching profile for user ${userId}`);

        const profileResponse = await axios.get(
          `${API_BASE_URL}/users/${userId}/profile`,
          config
        );

        if (!profileResponse.data.success) {
          throw new Error("Failed to fetch profile data");
        }

        const profileData = profileResponse.data.data;
        setUserDetails(profileData);
        setFollowerCount(profileData.followerCount);
        setFollowingCount(profileData.followingCount);
        setBakesCount(profileData.bakesCount);

        const endpoint = measure === "followers" ? "followers" : "following";
        const viewResponse = await axios.get(
          `${API_BASE_URL}/users/${userId}/${endpoint}`,
          config
        );

        if (!viewResponse.data.success) {
          throw new Error(`Failed to fetch ${measure} data`);
        }

        setSearchResults(viewResponse.data.data || []);
      } catch (error) {
        console.error("API Error:", error);

        if (error.response && error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(`Error fetching data: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, measure, API_BASE_URL, user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userDetails) return <div>No user details available</div>;

  return (
    <div className="followersView mt-16 mb-16">
      <Header />
      <FollowBar>
        <FollowTab
          number={followerCount}
          measure="followers"
          username={userName}
          userId={userId}
        />
        <FollowTab
          number={followingCount}
          measure="following"
          username={userName}
          userId={userId}
        />
        <FollowTab
          number={bakesCount}
          measure="bakes"
          username={userName}
          userId={userId}
        />
      </FollowBar>
      <SearchBar />
      {searchResults.length > 0 ? (
        searchResults.map((result) => (
          <SearchResult
            key={result.follower_id || result.following_id}
            userId={result.follower_id || result.following_id}
            searchReturnValue={
              result.follower_username || result.following_username
            }
            currentUserId={userId}
            type="user"
            imageUrl={result.follower_photo || result.following_photo}
            recipeId={null}
          />
        ))
      ) : (
        <div>No {measure} available</div>
      )}
      <Footer />
    </div>
  );
}

export default FollowersView;

import "../App.css";
import HomeCardMobile from "./multipurpose/HomeCardMobile.jsx";
import HomeCardDesktop from "./multipurpose/HomeCardDesktop.jsx";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function HomeView() {
  const auth = useAuth();
  const { user, getToken, session } = auth;
  const [bakeDetails, setBakeDetails] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);

        console.log("Auth context:", auth);
        console.log("User object:", user);
        console.log("Session object:", session);

        if (!user) {
          console.log("No user found - please log in");
          setIsLoading(false);
          return;
        }

        let token = null;
        if (typeof getToken === "function") {
          token = getToken();
          console.log(
            "Token from getToken():",
            token ? `${token.substring(0, 10)}...` : "null"
          );
        } else if (session && session.access_token) {
          token = session.access_token;
          console.log(
            "Token from session.access_token:",
            token ? `${token.substring(0, 10)}...` : "null"
          );
        }

        if (!token) {
          console.error("No authentication token available");
          console.log("Will try to fetch without authentication");
        }

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        headers["Content-Type"] = "application/json";

        console.log("Request headers:", headers);
        console.log("Sending request to:", `${API_URL}/api/bakes/home`);

        const response = await axios.get(`${API_URL}/api/bakes/home`, {
          headers: headers,
        });

        console.log("Response received:", response.status);

        if (isMounted) {
          setBakeDetails(response.data.bakeDetails || []);
          setCurrentUserId(response.data.currentUserId || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching home feed:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
          console.error("Response headers:", error.response.headers);
        }

        console.log("This should be your server URL:", API_URL);

        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, getToken, session, auth]);

  if (!user) {
    return (
      <div>
        <HeaderFooter>
          <div className="mt-20 mb-20 flex flex-col items-center">
            <div className="text-xl mb-4">
              Please log in to view the home feed
            </div>
          </div>
        </HeaderFooter>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (!bakeDetails || bakeDetails.length === 0)
    return <div>No bakes available</div>;

  return (
    <div>
      <HeaderFooter>
        <div className="mt-20 mb-20 flex flex-col items-center">
          {bakeDetails.map((bake) => (
            <div key={bake.bake_id}>
              {windowWidth > 768 ? (
                <HomeCardDesktop
                  bakeId={bake.bake_id}
                  photos={bake.photos}
                  username={bake.username}
                  recipeTitle={bake.recipe_title}
                  path={[
                    `/profile/${bake.username}`,
                    `/recipe/${bake.recipe_id}`,
                  ]}
                  userId={bake.user_id}
                  currentUserId={currentUserId}
                  recipeId={bake.recipe_id}
                />
              ) : (
                <HomeCardMobile
                  bakeId={bake.bake_id}
                  photos={bake.photos}
                  username={bake.username}
                  recipeTitle={bake.recipe_title}
                  path={[
                    `/profile/${bake.username}`,
                    `/recipe/${bake.recipe_id}`,
                  ]}
                  userId={bake.user_id}
                  currentUserId={currentUserId}
                  recipeId={bake.recipe_id}
                />
              )}
            </div>
          ))}
        </div>
      </HeaderFooter>
    </div>
  );
}

export default HomeView;

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

  const API_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

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

        if (!user) {
          setIsLoading(false);
          return;
        }

        let token = null;
        if (typeof getToken === "function") {
          token = getToken();
        } else if (session && session.access_token) {
          token = session.access_token;
        }

        if (!token) {
          console.error("No authentication token available");
        }

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        headers["Content-Type"] = "application/json";

        const response = await axios.get(`${API_URL}/bakes/home`, {
          headers: headers,
        });

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

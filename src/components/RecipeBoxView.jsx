import "../App.css";
import { Plus } from "lucide-react";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeCard from "./multipurpose/RecipeCard.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:8080/api";

function RecipeBoxHeader({ username }) {
  const navigate = useNavigate();
  const pageTitle = `${username}'s recipe box`;
  return (
    <div className="w-350 md:w-full max-w-4xl flex flex-row justify-between items-center">
      <div className="pageTitle text-xl">{pageTitle}</div>
      <Plus size={30} color="#192F01" />
      {/* <Plus size={30} color='#192F01' onClick={() => navigate('/reciperetriever')}/> */}
    </div>
  );
}

function RecipeBoxView() {
  const location = useLocation();
  const userId = location.state?.userId;

  const [userDetails, setUserDetails] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchUserAndRecipes() {
      if (!userId) {
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

        const response = await axios.get(
          `${API_BASE_URL}/recipes/recipebox/${userId}`,
          config
        );

        console.log(response);

        setUserDetails(response.data.username);
        setSavedRecipes(response.data.savedRecipes);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserAndRecipes();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  return (
    <div>
      <HeaderFooter>
        {windowWidth > 768 ? (
          <div className="mt-16 mb-16 px-8 flex flex-col items-center w-full">
            <RecipeBoxHeader username={userDetails} />
            <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mt-8">
              {savedRecipes && savedRecipes.length > 0 ? (
                savedRecipes.map((recipe) => (
                  <div key={recipe.recipe_id} className="flex justify-center">
                    <RecipeCard
                      recipeTitle={recipe.recipe_title}
                      totalTime={recipe.total_time}
                      recipeId={recipe.recipe_id}
                      photo={recipe.recipe_images?.[0]}
                    />
                  </div>
                ))
              ) : (
                <div>No saved recipes available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-16 mb-16  flex flex-col items-center w-full">
            <RecipeBoxHeader username={username} />
            <div className="flex flex-col gap-2 mt-4 w-350">
              {savedRecipes && savedRecipes.length > 0 ? (
                savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipeTitle={recipe.recipe_title}
                    totalTime={recipe.total_time}
                    recipeId={recipe.recipe_id}
                    photo={recipe.recipe_images?.[0]}
                  />
                ))
              ) : (
                <div>No saved recipes available</div>
              )}
            </div>
          </div>
        )}
      </HeaderFooter>
    </div>
  );
}

export default RecipeBoxView;

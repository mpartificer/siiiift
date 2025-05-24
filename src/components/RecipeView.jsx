import "../App.css";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import {
  Cookie,
  Plus,
  SquareArrowOutUpRight,
  ChefHat,
  Bookmark,
  Heart,
  Star,
  Minus,
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HomeCardMobile from "./multipurpose/HomeCardMobile";
import { useAuth } from "../AuthContext";

// API base URL - should be configured from environment variables in a real app
const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:8080/api";
const DEFAULT_IMAGE_URL =
  "https://iivozawppltyhsrkixlk.supabase.co/storage/v1/object/public/recipe-images//ChatGPT%20Image%20May%2019,%202025,%2003_17_24%20PM.png";

function RecipeOptions({
  originalLink,
  recipeId,
  currentUserId,
  onBakesClick,
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    if (currentUserId) {
      // Only check if currentUserId exists
      checkIfSaved();
    } else {
      setIsLoading(false); // Make sure to set loading to false if no user
    }
  }, [currentUserId, recipeId]);

  const checkIfSaved = async () => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipeId}/saves/check/${currentUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setIsSaved(data.isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!currentUserId || isLoading) return;

    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipeId}/saves/toggle`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      setIsSaved(result.isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ul className="menu menu-horizontal bg-primary rounded-box w-350 items-stretch justify-evenly">
      <li>
        <button
          className="tooltip tooltip-bottom "
          data-tip={isSaved ? "remove save" : "add to recipe box"}
          onClick={handleSaveToggle}
          disabled={isLoading || !currentUserId}
        >
          {isSaved ? <Minus color="#EBD2AD" /> : <Plus color="#EBD2AD" />}
        </button>
      </li>
      <li>
        <button
          className="tooltip tooltip-bottom"
          data-tip="see bakes"
          onClick={onBakesClick}
        >
          <Cookie color="#EBD2AD" />
        </button>
      </li>
      <li>
        <a
          className="tooltip tooltip-bottom"
          data-tip="go to original author"
          href={originalLink}
        >
          <SquareArrowOutUpRight color="#EBD2AD" />
        </a>
      </li>
      <li>
        <button
          className="tooltip tooltip-bottom"
          data-tip="bake"
          disabled={!currentUserId}
        >
          <ChefHat color="#EBD2AD" />
        </button>
      </li>
    </ul>
  );
}

function RecipeCheckPanel(props) {
  const propInsert = props.propInsert;
  const confirmRecipeItem = props.confirmRecipeItem;

  if (!Array.isArray(propInsert)) {
    return <div>Error: Invalid data format</div>;
  }

  let myComponentList;

  if (confirmRecipeItem === "ingredients") {
    myComponentList = propInsert.map((item, index) => {
      if (typeof item === "object" && item !== null) {
        return <li key={index}>{item}</li>;
      } else {
        return <li key={index}>{item}</li>;
      }
    });
  } else if (confirmRecipeItem === "instructions") {
    myComponentList = propInsert.map((item, index) => {
      const instruction = typeof item === "string" ? item : item;
      return (
        <li key={index} className="mb-2">
          {index + 1}. {instruction}
        </li>
      );
    });
  } else {
    return <div>Error: Unknown recipe item type</div>;
  }

  return (
    <div className="recipeCheckPanel p-4 w-350">
      <RecipeCheckTitle recipeCheckTitle={confirmRecipeItem} />
      <ul className="pl-1.5">{myComponentList}</ul>
    </div>
  );
}

function TimeCheck(props) {
  return (
    <div className="items-center max-w-28 text-sm md:text-md">
      <b>prep</b>
      <br /> {props.prepTime} <br />
      <b>cook</b>
      <br /> {props.cookTime} <br />
      <b>total</b>
      <br /> {props.totalTime} <br />
    </div>
  );
}

function PopularityCheck(props) {
  return (
    <div className="grid grid-cols-2 text-sm md:text-md">
      <PopularityCounter Label="Heart" Count={props.likes} />
      <PopularityCounter Label="Star" Count={props.rating} />
      <PopularityCounter Label="ChefHat" Count={props.bakes} />
      <PopularityCounter Label="Bookmark" Count={props.saves} />
    </div>
  );
}

function PopularityCounter(props) {
  var descriptor = "";
  if (props.Label === "Heart") {
    descriptor = "likes";
    return (
      <div className="followTab">
        <Heart
          color={props.Count > 0 ? "palevioletred" : "#496354"}
          size={40}
          fill={props.Count > 0 ? "palevioletred" : "none"}
        />
        {props.Count} {descriptor}
      </div>
    );
  } else if (props.Label === "Star") {
    descriptor = "stars";
    return (
      <div className="followTab">
        <Star color="#496354" size={40} />
        {props.Count} {descriptor}
      </div>
    );
  } else if (props.Label === "ChefHat") {
    descriptor = "bakes";
    return (
      <div className="followTab">
        <ChefHat color="#496354" size={40} />
        {props.Count} {descriptor}
      </div>
    );
  } else if (props.Label === "Bookmark") {
    descriptor = "saves";
    return (
      <div className="followTab">
        <Bookmark color="#496354" size={40} />
        {props.Count} {descriptor}
      </div>
    );
  }
}

function RecipeSummaryPanel(props) {
  return (
    <div className="recipeCheckPanel w-350 flex flex-row p-5 justify-between">
      <TimeCheck
        totalTime={props.totalTime}
        cookTime={props.cookTime}
        prepTime={props.prepTime}
      />
      <div className="divider divider-primary divider-horizontal"></div>
      <PopularityCheck
        likes={props.likes}
        saves={props.saves}
        bakes={props.bakes}
        rating={props.rating}
      />
    </div>
  );
}

function RecipeCheckTitle(props) {
  return <div className="recipeCheckTitle">{props.recipeCheckTitle}</div>;
}

function BakesList({ recipeId, currentUserId, isMobile }) {
  const [bakes, setBakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchBakes() {
      try {
        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/recipes/${recipeId}/bakes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setBakes(data || []);
      } catch (error) {
        console.error("Error fetching bakes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBakes();
  }, [recipeId, getToken]);

  if (isLoading) return <div className="text-center">Loading bakes...</div>;
  if (bakes.length === 0)
    return <div className="text-center">No bakes yet</div>;

  return (
    <div
      className={
        isMobile
          ? "flex flex-col gap-4"
          : "flex flex-row flex-wrap justify-center gap-4"
      }
    >
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
  );
}

function RecipeView() {
  const location = useLocation();
  const recipeId = location.state.recipeId;
  const bakesRef = useRef(null);
  const leftColumnRef = useRef(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState(0);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ratingDetails, setRatingDetails] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [bakesCount, setBakesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, getToken } = useAuth();
  const currentUserId = user?.id || null;

  // Effect for window resize and initial data fetch
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateLeftColumnHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Separate effect for updating height after data is loaded
  useEffect(() => {
    if (!isLoading && leftColumnRef.current) {
      updateLeftColumnHeight();
    }
  }, [isLoading, recipeDetails]);

  // Function to update left column height
  const updateLeftColumnHeight = () => {
    if (leftColumnRef.current) {
      // Add a small delay to ensure DOM has updated
      requestAnimationFrame(() => {
        setLeftColumnHeight(leftColumnRef.current.offsetHeight);
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken();

        // Make API requests to your backend
        const [recipeResponse, ratingsResponse, statsResponse] =
          await Promise.all([
            // Get recipe details
            fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            // Get ratings
            fetch(`${API_BASE_URL}/recipes/${recipeId}/ratings`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            // Get stats (likes, saves, bakes)
            fetch(`${API_BASE_URL}/recipes/${recipeId}/stats`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          ]);

        // Check for HTTP errors
        if (!recipeResponse.ok)
          throw new Error(
            `Recipe API request failed: ${recipeResponse.status}`
          );
        if (!ratingsResponse.ok)
          throw new Error(
            `Ratings API request failed: ${ratingsResponse.status}`
          );
        if (!statsResponse.ok)
          throw new Error(`Stats API request failed: ${statsResponse.status}`);

        // Parse JSON responses
        const recipeData = await recipeResponse.json();
        const ratingsData = await ratingsResponse.json();
        const statsData = await statsResponse.json();

        // Update state with fetched data
        setRecipeDetails(recipeData);
        setRatingDetails(ratingsData);
        setLikesCount(statsData.likesCount || 0);
        setSavesCount(statsData.savesCount || 0);
        setBakesCount(statsData.bakesCount || 0);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [recipeId, getToken]);

  if (isLoading) return <div>Loading...</div>;
  if (!recipeDetails) return <div>No recipe details available</div>;

  // Define all variables from recipeDetails
  const recipeTitle = recipeDetails.title.toString();
  const totalTime = recipeDetails.total_time.toString();
  const cookTime = recipeDetails.cook_time.toString();
  const prepTime = recipeDetails.prep_time.toString();
  const ingredients = recipeDetails?.ingredients || [];
  const instructions = recipeDetails?.instructions || [];
  const originalLink = recipeDetails.original_link;
  const photos = recipeDetails.images;

  let rating = 0;

  // Check if ratingDetails exists and has data
  if (
    ratingDetails &&
    ratingDetails[0] &&
    Array.isArray(ratingDetails[0].all_ratings) &&
    ratingDetails[0].all_ratings.length > 0
  ) {
    let ratingSum = ratingDetails[0].all_ratings.reduce(
      (sum, rating) => sum + rating,
      0
    );
    rating = (ratingSum / ratingDetails[0].all_ratings.length).toFixed(2);
  }

  const handleBakesScroll = () => {
    const element = bakesRef.current;
    if (!element) return;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const headerOffset = 100; // Adjust this value based on your header height
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <HeaderFooter>
        {windowWidth > 768 ? (
          <div className="flex flex-col mt-20 mb-16 gap-8 w-full items-center">
            <div className="flex flex-row gap-8 w-full justify-center">
              <div
                ref={leftColumnRef}
                className="flex flex-col gap-4 items-end"
              >
                <div className="pageTitle text-xl text-right w-350">
                  {recipeTitle}
                </div>
                <img
                  src={photos || DEFAULT_IMAGE_URL}
                  alt="recipe image"
                  className="recipeImg"
                  onLoad={updateLeftColumnHeight} // Add this to handle image load
                />
                <RecipeSummaryPanel
                  totalTime={totalTime}
                  cookTime={cookTime}
                  prepTime={prepTime}
                  likes={likesCount}
                  bakes={bakesCount}
                  saves={savesCount}
                  rating={rating}
                />
              </div>
              {!isLoading && leftColumnHeight > 0 && (
                <div
                  className="flex flex-col gap-2 overflow-y-auto"
                  style={{ maxHeight: `${leftColumnHeight}px` }}
                >
                  <RecipeOptions
                    originalLink={originalLink}
                    recipeId={recipeId}
                    currentUserId={currentUserId}
                    onBakesClick={handleBakesScroll}
                  />
                  <RecipeCheckPanel
                    propInsert={ingredients}
                    confirmRecipeItem="ingredients"
                  />
                  <RecipeCheckPanel
                    propInsert={instructions}
                    confirmRecipeItem="instructions"
                  />
                </div>
              )}
            </div>
            <div
              className="divider divider-accent w-1/2 self-center"
              ref={bakesRef}
            >
              bakes
            </div>
            <div className="w-full max-w-7xl px-4">
              <BakesList
                recipeId={recipeId}
                currentUserId={currentUserId}
                isMobile={false}
              />
            </div>
          </div>
        ) : (
          <div className="followersView mt-16 mb-16 text-xl wrap">
            <div className="pageTitle max-w-350">{recipeTitle}</div>
            <img
              src={photos || DEFAULT_IMAGE_URL}
              alt="recipe image"
              className="recipeImg"
            />
            <RecipeOptions
              originalLink={originalLink}
              recipeId={recipeId}
              currentUserId={currentUserId}
              onBakesClick={handleBakesScroll}
            />
            <RecipeSummaryPanel
              totalTime={totalTime}
              cookTime={cookTime}
              prepTime={prepTime}
              likes={likesCount}
              bakes={bakesCount}
              saves={savesCount}
              rating={rating}
            />
            <RecipeCheckPanel
              propInsert={ingredients}
              confirmRecipeItem="ingredients"
            />
            <RecipeCheckPanel
              propInsert={instructions}
              confirmRecipeItem="instructions"
            />
            <div
              className="divider divider-accent w-1/2 self-center"
              ref={bakesRef}
            >
              bakes
            </div>
            <div className="mt-8">
              <BakesList
                recipeId={recipeId}
                currentUserId={currentUserId}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </HeaderFooter>
    </div>
  );
}

export default RecipeView;

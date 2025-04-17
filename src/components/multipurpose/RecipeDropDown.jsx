import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import "../../App.css";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8080";

const ModificationItem = ({ items, placeholder, index, type }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { register, setValue, watch } = useFormContext();

  const fieldName =
    type === "ingredient"
      ? `ingredientModifications.${index}`
      : `instructionModifications.${index}`;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    setValue(
      `${fieldName}.original${
        type === "ingredient" ? "Ingredient" : "Instruction"
      }`,
      type === "ingredient"
        ? `${item.amount} ${item.substance}`
        : item.instruction
    );
  };

  return (
    <div className="flex flex-col mb-2">
      <div className="dropdown mb-1 md:m-0">
        <div
          tabIndex={0}
          role="button"
          className="btn w-80 bg-secondary modificationDropDown"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedItem
            ? typeof selectedItem === "object"
              ? selectedItem.instruction ||
                `${selectedItem.amount} ${selectedItem.substance}`
              : selectedItem
            : "select item"}
        </div>
        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow max-h-64 flex-nowrap overflow-y-auto"
          >
            {items.map((item, idx) => (
              <li key={idx} onClick={() => handleSelect(item)}>
                <a>
                  {typeof item === "object"
                    ? item.instruction || `${item.amount} ${item.substance}`
                    : item}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="input w-80 max-w-xs customModification"
        {...register(
          `${fieldName}.modified${
            type === "ingredient" ? "Ingredient" : "Instruction"
          }`
        )}
      />
    </div>
  );
};

const RecipeDropDown = () => {
  const [recipeData, setRecipeData] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredientData, setIngredientData] = useState(null);
  const [instructionData, setInstructionData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecipeDropdownOpen, setIsRecipeDropdownOpen] = useState(false);

  const { control, setValue } = useFormContext();
  const { user, getToken } = useAuth();

  const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
    control,
    name: "ingredientModifications",
  });
  const { fields: instructionFields, append: appendInstruction } =
    useFieldArray({
      control,
      name: "instructionModifications",
    });

  // Helper to make authenticated API requests
  const apiRequest = async (url, method = "GET", data = null) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios({
        method,
        url: `${API_URL}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data,
      });

      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  const fetchModItems = async (recipeId, recipeTitle) => {
    setValue("recipeId", recipeId);
    setValue("recipeTitle", recipeTitle);

    try {
      // Get recipe details from the new backend endpoint
      const recipeDetails = await apiRequest(`/api/recipes/${recipeId}`);

      if (!recipeDetails) throw new Error("Recipe details not found");

      setIngredientData(recipeDetails.ingredients);
      setInstructionData(recipeDetails.instructions);
      setSelectedRecipe(recipeId);
      setIsRecipeDropdownOpen(false);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError(err.message || "Failed to fetch recipe details");
    }
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        if (!user || !user.id) {
          throw new Error("User not authenticated");
        }

        // Get user's saved recipes from the new dropdown-specific endpoint
        const savedRecipes = await apiRequest(
          `/api/recipes/dropdown-data/${user.id}`
        );

        setRecipeData(savedRecipes);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        setError(err.message || "Failed to fetch saved recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profilePlate items-center">
      <div className="dropdown ">
        <div
          tabIndex={0}
          role="button"
          className="btn m-1 md:m-0 w-80 bg-secondary overflow-y-auto modificationDropDown"
          onClick={() => setIsRecipeDropdownOpen(!isRecipeDropdownOpen)}
        >
          {selectedRecipe
            ? recipeData.find((item) => item.recipe_id === selectedRecipe)
                ?.recipe_title
            : "select a recipe:"}
        </div>
        {isRecipeDropdownOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-secondary max-h-64 flex-nowrap overflow-y-auto rounded-box z-[1] w-52 p-2 shadow"
          >
            {recipeData &&
              recipeData.map((item) => (
                <li
                  key={item.recipe_id}
                  onClick={() =>
                    fetchModItems(item.recipe_id, item.recipe_title)
                  }
                >
                  <a>{item.recipe_title}</a>
                </li>
              ))}
          </ul>
        )}
      </div>

      {selectedRecipe && (
        <>
          <div className="flex w-80 justify-start">
            <h3 className="mt-4 mb-2 overflow-hidden">
              ingredient modifications:
            </h3>
          </div>
          {ingredientFields.map((field, index) => (
            <ModificationItem
              key={field.id}
              items={ingredientData || []}
              placeholder="enter your ingredient modification"
              index={index}
              type="ingredient"
            />
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              appendIngredient({
                originalIngredient: "",
                modifiedIngredient: "",
              });
            }}
            className="mb-4 justify-self-end text-left hover:underline cursor-pointer"
          >
            <div className="flex w-80 justify-end">
              add another ingredient modification
            </div>
          </button>

          <div className="flex w-80 justify-start">
            <h3 className="mt-4 mb-2 overflow-hidden">
              instruction modifications:
            </h3>
          </div>
          {instructionFields.map((field, index) => (
            <ModificationItem
              key={field.id}
              items={instructionData || []}
              placeholder="enter your instruction modification"
              index={index}
              type="instruction"
            />
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              appendInstruction({
                originalInstruction: "",
                modifiedInstruction: "",
              });
            }}
            className="mb-4 justify-self-end text-left hover:underline cursor-pointer"
          >
            <div className="flex w-80 justify-end">
              add another instruction modification
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default RecipeDropDown;

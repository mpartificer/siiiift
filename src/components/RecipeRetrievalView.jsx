import "../App.css";
import React, { useState, useEffect } from "react";
import CheckBox from "./multipurpose/CheckBox.jsx";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import SearchBar from "./multipurpose/SearchBar.jsx";
import BigSubmitButton from "./multipurpose/BigSubmitButton.jsx";
import EnhancedImageUploader from "./multipurpose/EnhancedImageUploader.jsx";
import { useAuth } from "../AuthContext.jsx";

function RecipeCheckPanel(props) {
  const { propInsert, confirmRecipeItem, onItemUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(propInsert || []);

  // Update items when propInsert changes
  useEffect(() => {
    setItems(propInsert || []);
  }, [propInsert]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);

    if (isEditing && onItemUpdate) {
      onItemUpdate(confirmRecipeItem, items);
    }
  };

  const handleSingleItemChange = (event) => {
    setItems([event.target.value]);
  };

  const handleItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index] = event.target.value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const renderContent = () => {
    if (
      items.length <= 1 ||
      confirmRecipeItem === "recipe title" ||
      confirmRecipeItem === "prep time" ||
      confirmRecipeItem === "cook time" ||
      confirmRecipeItem === "total time" ||
      confirmRecipeItem === "original author"
    ) {
      return (
        <div>
          <input
            type="text"
            className="w-full p-2 bg-primary text-secondary border rounded"
            value={items[0] || ""}
            onChange={handleSingleItemChange}
            placeholder={`enter ${confirmRecipeItem}`}
          />
        </div>
      );
    }

    return (
      <div>
        <ul className="list-none w-full">
          {items.map((item, index) => (
            <li key={index} className="mb-2 flex items-center">
              <textarea
                className="w-full p-2 border rounded resize-y min-h-[50px]"
                value={item}
                onChange={(e) => handleItemChange(index, e)}
                placeholder={`Enter ${confirmRecipeItem} item`}
              />
              <button
                type="button"
                className="ml-2 text-red-500 text-xl"
                onClick={() => handleRemoveItem(index)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-2 px-3 py-1 bg-accent text-white text-sm rounded"
          onClick={handleAddItem}
        >
          + Add{" "}
          {confirmRecipeItem === "ingredients"
            ? "Ingredient"
            : confirmRecipeItem === "instructions"
            ? "Step"
            : "Item"}
        </button>
      </div>
    );
  };

  const renderViewContent = () => {
    return (
      <ul className="recipeCheckPanelList w-full">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="recipeCheckPanel p-4 border rounded-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <RecipeCheckTitle recipeCheckTitle={props.confirmRecipeItem} />
        <div className="flex align-items-center items-center">
          <button
            type="button"
            className="text-accent text-sm underline mr-3"
            onClick={toggleEdit}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <CheckBox confirmRecipeItem={props.confirmRecipeItem} />
        </div>
      </div>

      {isEditing ? renderContent() : renderViewContent()}
    </div>
  );
}

function RecipeCheckTitle(props) {
  return (
    <div className="recipeCheckTitle font-semibold">
      {props.recipeCheckTitle}
    </div>
  );
}

function InputSelector() {
  const [inputMethod, setInputMethod] = useState("url");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedRecipe, setExtractedRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: [],
    prepTime: "",
    cookTime: "",
    totalTime: "",
    originalAuthor: "",
    defaultImage: "", // Keep this for display but don't send to server
    originalText: "",
  });
  const [error, setError] = useState(null);
  const { getToken, user } = useAuth();

  const API_BASE_URL =
    import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

  const handleImagesSelected = (selectedImages) => {
    // This can be used for previewing images before processing
  };

  const handleRecipeExtracted = (recipeData) => {
    console.log("Recipe extracted:", recipeData);
    setExtractedRecipe(recipeData);
    setIsLoading(false);

    // If there was an OCR error, show a notification
    if (recipeData.ocrError) {
      alert(
        "OCR processing encountered an error. You can still enter the recipe details manually."
      );
    }
  };

  const handleUrlSubmit = async (url) => {
    if (!url) return;

    setIsLoading(true);

    try {
      if (user) {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/recipes/analyze-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url,
            userId: user.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          handleRecipeExtracted(data);
          return;
        } else {
          console.error("Error from server:", await response.json());
        }
      }

      alert("Please log in to process URLs or upload images directly");
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing URL:", error);
      setIsLoading(false);
      alert(
        "Error processing URL. Please try again or upload images directly."
      );
    }
  };

  // Handle recipe field updates from panels
  const handleRecipeFieldUpdate = (fieldName, fieldValue) => {
    const updatedRecipe = { ...extractedRecipe };

    switch (fieldName) {
      case "recipe title":
        updatedRecipe.title = fieldValue[0] || "";
        break;
      case "ingredients":
        updatedRecipe.ingredients = fieldValue;
        break;
      case "instructions":
        updatedRecipe.instructions = fieldValue;
        break;
      case "prep time":
        updatedRecipe.prepTime = fieldValue[0] || "";
        break;
      case "cook time":
        updatedRecipe.cookTime = fieldValue[0] || "";
        break;
      case "total time":
        updatedRecipe.totalTime = fieldValue[0] || "";
        break;
      case "original author":
        updatedRecipe.originalAuthor = fieldValue[0] || "";
        break;
      default:
        break;
    }

    setExtractedRecipe(updatedRecipe);
  };

  const saveRecipe = async () => {
    if (!user) {
      alert("Please log in to save this recipe");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Saving recipe to database");

      // Format the recipe data according to what the backend expects
      // Explicitly exclude the defaultImage property
      const recipeDataToSend = {
        title: extractedRecipe.title || "Untitled Recipe",
        ingredients: extractedRecipe.ingredients || [],
        instructions: extractedRecipe.instructions || [],
        prep_time: extractedRecipe.prepTime || "",
        cook_time: extractedRecipe.cookTime || "",
        total_time: extractedRecipe.totalTime || "",
        original_link: extractedRecipe.originalAuthor || "Unknown",
        // Note: we're not including the image data at all
      };

      // Log the data being sent to help debug
      console.log("Sending recipe data:", {
        userId: user.id,
        recipeData: recipeDataToSend,
      });

      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/recipes/store-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          recipeData: recipeDataToSend,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.error || errorData.message || "Unknown server error";
        } catch (e) {
          errorMessage = errorText || "Unknown server error";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      alert("Recipe saved successfully!");

      // Clear the form after success
      setExtractedRecipe({
        title: "",
        ingredients: [],
        instructions: [],
        prepTime: "",
        cookTime: "",
        totalTime: "",
        originalAuthor: "",
        defaultImage: "",
        originalText: "",
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      setError(error.message || "Error saving recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show the original OCR text for reference
  const [showOriginalText, setShowOriginalText] = useState(false);

  const toggleOriginalText = () => {
    setShowOriginalText(!showOriginalText);
  };

  return (
    <div className="mb-6">
      <div className="flex grow space-x-4 mb-4">
        <button
          className={`py-4 px-4 grow font-semibold rounded-md ${
            inputMethod === "url"
              ? "bg-accent text-white"
              : "bg-secondary text-gray-800"
          }`}
          onClick={() => setInputMethod("url")}
        >
          website url
        </button>
        <button
          className={`py-4 px-4 grow font-semibold rounded-md ${
            inputMethod === "image"
              ? "bg-accent text-white"
              : "bg-secondary text-gray-800"
          }`}
          onClick={() => setInputMethod("image")}
        >
          cookbook images
        </button>
      </div>

      {inputMethod === "url" ? (
        <div>
          <SearchBar
            placeholder="enter recipe url"
            onSubmit={handleUrlSubmit}
            isLoading={isLoading}
          />
          {isLoading && !extractedRecipe.title && (
            <div className="mt-2 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-gray-600">Processing URL...</p>
            </div>
          )}
        </div>
      ) : (
        <EnhancedImageUploader
          onImagesSelected={handleImagesSelected}
          onRecipeExtracted={handleRecipeExtracted}
        />
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Recipe display panels only show when we have data */}
      {extractedRecipe.title && (
        <div className="space-y-4 mt-6">
          {/* Original OCR Text Toggle */}
          {extractedRecipe.originalText && (
            <div className="mb-4">
              <button
                onClick={toggleOriginalText}
                className="text-accent underline text-sm"
              >
                {showOriginalText
                  ? "Hide Original OCR Text"
                  : "Show Original OCR Text"}
              </button>

              {showOriginalText && (
                <div className="mt-2 p-3 bg-gray-100 rounded overflow-auto max-h-40">
                  <pre className="text-xs whitespace-pre-wrap">
                    {extractedRecipe.originalText}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="mb-4 bg-yellow-50 p-4 rounded-md">
            <p className="text-sm">
              <strong>Tip:</strong> Please review and edit the recipe details
              below. The OCR process may not be perfect, especially with
              handwritten notes or unusual formatting. Click "Edit" on any
              section to make changes.
            </p>
          </div>

          <RecipeCheckPanel
            propInsert={[extractedRecipe.title]}
            confirmRecipeItem="recipe title"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={extractedRecipe.ingredients}
            confirmRecipeItem="ingredients"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={extractedRecipe.instructions}
            confirmRecipeItem="instructions"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={[extractedRecipe.prepTime]}
            confirmRecipeItem="prep time"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={[extractedRecipe.cookTime]}
            confirmRecipeItem="cook time"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={[extractedRecipe.totalTime]}
            confirmRecipeItem="total time"
            onItemUpdate={handleRecipeFieldUpdate}
          />
          <RecipeCheckPanel
            propInsert={[extractedRecipe.originalAuthor]}
            confirmRecipeItem="original author"
            onItemUpdate={handleRecipeFieldUpdate}
          />

          {/* Recipe image display - keep just for display purposes */}
          {extractedRecipe.defaultImage && (
            <div className="mt-4">
              <p className="font-medium mb-2">
                recipe image (preview only - will not be saved)
              </p>
              <img
                src={
                  typeof extractedRecipe.defaultImage === "string"
                    ? extractedRecipe.defaultImage
                    : `data:${extractedRecipe.defaultImage.mimetype};base64,${extractedRecipe.defaultImage.buffer}`
                }
                alt="Recipe"
                className="w-full max-w-md mx-auto h-auto object-cover rounded"
              />
            </div>
          )}

          <div className="mt-6">
            <BigSubmitButton
              submitValue={isLoading ? "Saving..." : "Save Recipe"}
              onClick={saveRecipe}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EnhancedSearchBar({ placeholder, onSubmit, isLoading }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        className="px-4 py-3 w-full border border-primary rounded-md"
        placeholder={placeholder || "Search..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-md"
        disabled={isLoading}
      >
        {isLoading ? "..." : "Go"}
      </button>
    </form>
  );
}

function RecipeRetrievalView() {
  return (
    <div>
      <HeaderFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            recipe extractor
          </h1>

          <InputSelector />
        </div>
      </HeaderFooter>
    </div>
  );
}

export default RecipeRetrievalView;

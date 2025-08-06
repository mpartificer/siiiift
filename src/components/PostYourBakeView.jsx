import React, { useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import RecipeDropDown from "./multipurpose/RecipeDropDown.jsx";
import EnhancedImageUploader from "./multipurpose/EnhancedImageUploader.jsx";
import { addGlobalToast } from "./multipurpose/ToastManager.jsx";
import { Loader2 } from "lucide-react";

// API base URL (replace with your actual API URL)
const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

function ModificationRating() {
  const { control } = useFormContext();

  return (
    <div className="profilePlateTop w-80 md:w-full space-between">
      <div className="recipeCheckTitle">rate: </div>
      <Controller
        name="rating"
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <div className="rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                name="rating-1"
                className="mask mask-star"
                checked={field.value === value}
                onChange={() => field.onChange(value)}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
}

function BakePostDate() {
  const { control } = useFormContext();

  return (
    <div className="profilePlateTop w-80 md:w-full space-between">
      <div className="recipeCheckTitle">date of bake:</div>
      <Controller
        name="bakeDate"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input type="date" {...field} className="dateEntry bg-secondary" />
        )}
      />
    </div>
  );
}

function PostYourBakeView() {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm({
    defaultValues: {
      rating: 0,
      bakeDate: "",
      recipeId: "",
      recipeTitle: "",
      ingredientModifications: [
        {
          originalIngredient: "",
          modifiedIngredient: "",
        },
      ],
      instructionModifications: [
        {
          originalInstruction: "",
          modifiedInstruction: "",
        },
      ],
    },
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle images selected from EnhancedImageUploader
  const handleImagesSelected = (images) => {
    setSelectedImages(images);
    setError(null);
  };

  // We don't want to use the recipe extraction functionality here
  const handleRecipeExtracted = () => {
    // Do nothing - we're not using server-side recipe extraction in this component
  };

  const onSubmit = async (formData) => {
    setError(null);
    setIsUploading(true);

    try {
      // Check if any images were selected
      if (selectedImages.length === 0) {
        throw new Error("Please select at least one image for your bake");
      }

      // Get current session for authentication
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Create form data for API request
      const apiFormData = new FormData();

      // Add images to form data
      selectedImages.forEach((file) => {
        // Use the original file object for upload
        const fileToUpload = file.preview ? file : file;
        apiFormData.append("files", fileToUpload);
      });

      // Add form data as JSON
      apiFormData.append(
        "data",
        JSON.stringify({
          userId: session.user.id,
          rating: formData.rating,
          bakeDate: formData.bakeDate,
          recipeId: formData.recipeId,
          recipeTitle: formData.recipeTitle,
          ingredientModifications: formData.ingredientModifications,
          instructionModifications: formData.instructionModifications,
        })
      );

      // Show loading toast
      addGlobalToast({
        type: "loading",
        message: "uploading your bake...",
      });

      // Send request to backend API
      const response = await fetch(`${API_BASE_URL}/bakes/post-bake`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: apiFormData,
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload bake");
      }

      const result = await response.json();

      // Update loading toast for AI analysis
      addGlobalToast({
        type: "loading",
        message: "analyzing your bake... (this may take a few minutes)",
      });

      // Reset form and navigate
      setSelectedImages([]);
      methods.reset();

      // Navigate to the page specified in the response
      const redirectUrl = result.data.redirectUrl;
      navigate(redirectUrl);

      // For now, just show a success message after a delay
      setTimeout(() => {
        addGlobalToast({
          type: "success",
          message: "AI analysis complete!",
          link: redirectUrl,
        });
      }, 30000); // Simulate a 30-second wait for analysis
    } catch (err) {
      console.error("Error posting bake:", err);
      setError(err.message);

      // Show error toast
      addGlobalToast({
        type: "error",
        message: "Failed to upload bake: " + err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const PostImageUpload = () => {
    return (
      <div className="w-5/6 md:w-full md:max-w-sm flex-shrink-0">
        <EnhancedImageUploader
          onImagesSelected={handleImagesSelected}
          onRecipeExtracted={handleRecipeExtracted}
        />
        {selectedImages.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-2 text-sm">
              selected images for your bake ({selectedImages.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  {file.preview && !file.conversionFailed ? (
                    <img
                      src={file.preview}
                      alt={`Bake image ${index + 1}`}
                      className="h-20 w-full object-cover rounded border"
                    />
                  ) : (
                    <div className="h-20 w-full flex items-center justify-center rounded border bg-gray-100">
                      <span className="text-xs text-gray-500 text-center p-1">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <HeaderFooter>
      {windowWidth > 768 ? (
        <FormProvider {...methods}>
          <form
            className="websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <RecipeDropDown />
            <div className="flex flex-col">
              <PostImageUpload />
              <ModificationRating />
              <BakePostDate />
              <button
                type="submit"
                className="bigSubmitButton"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center w-full gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>uploading...</span>
                  </div>
                ) : (
                  "post"
                )}
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...methods}>
          <form
            className="websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <PostImageUpload />
            <div className="w-full items-center md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
              <RecipeDropDown />
              <ModificationRating />
              <BakePostDate />
              <button
                type="submit"
                className="bigSubmitButton"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>uploading...</span>
                  </div>
                ) : (
                  "post"
                )}
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </form>
        </FormProvider>
      )}
    </HeaderFooter>
  );
}

export default PostYourBakeView;

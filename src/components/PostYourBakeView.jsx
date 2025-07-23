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
import heic2any from "heic2any";
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
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
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

  // Convert HEIC to JPEG in the browser environment
  async function convertHeicToJpeg(file) {
    try {
      // Convert HEIC to JPEG blob using heic2any
      const jpegBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });

      // Create a new File object with the converted data
      return new File([jpegBlob], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
      });
    } catch (error) {
      console.error("HEIC conversion error:", error);
      throw new Error(`Failed to convert HEIC file: ${error.message}`);
    }
  }

  const handleFile = async (e) => {
    setMessage("");
    let selectedFiles = Array.from(e.target.files);
    const validImageTypes = [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/heic",
    ];

    try {
      // Process each file - convert HEIC to JPEG if needed
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileType = file.type.toLowerCase();

          if (!validImageTypes.includes(fileType)) {
            throw new Error("Only images accepted");
          }

          // Convert HEIC files to JPEG before uploading
          if (fileType === "image/heic") {
            return await convertHeicToJpeg(file);
          }

          return file;
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeImage = (i) => {
    setFiles(files.filter((x) => x.name !== i));
  };

  const PostImageUpload = () => {
    return (
      <div className="w-5/6 md:w-full md:max-w-sm flex-shrink-0">
        <div className="rounded-lg shadow-xl bg-primary">
          <div className="m-4 md:mt-0">
            <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">
              {message}
            </span>
            <div className="flex w-full">
              <label className="flex cursor-pointer flex-col w-full h-64 md:h-96 border-2 rounded-md border-dashed hover:bg-secondary">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="p-3 text-center text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    select a photo of your bake - we recommend a nice
                    cross-section so we can examine all the layers and textures
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFile}
                  className="opacity-0"
                  multiple="multiple"
                  name="files[]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, key) => (
                <div key={key} className="overflow-hidden relative">
                  <i
                    onClick={() => {
                      removeImage(file.name);
                    }}
                    className="mdi mdi-close absolute right-1 hover:text-white cursor-pointer"
                  ></i>
                  <img
                    className="h-20 w-20 rounded-md"
                    src={URL.createObjectURL(file)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = async (formData) => {
    setError(null);
    setIsUploading(true);

    try {
      // Check if any files were selected
      if (files.length === 0) {
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

      // Add files to form data (already converted to JPEG if they were HEIC)
      files.forEach((file) => {
        apiFormData.append("files", file);
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
      setFiles([]);
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
              {message && <div className="success">{message}</div>}
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
              {message && <div className="success">{message}</div>}
            </div>
          </form>
        </FormProvider>
      )}
    </HeaderFooter>
  );
}

export default PostYourBakeView;

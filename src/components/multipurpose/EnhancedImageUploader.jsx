import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";

function EnhancedImageUploader({ onImagesSelected, onRecipeExtracted }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { getToken, user } = useAuth();

  const API_BASE_URL =
    import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

  useEffect(() => {
    return () => {
      selectedImages.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedImages]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      setError("No image files were selected. Please upload images only.");
      return;
    }

    setSelectedImages((prev) => [...prev, ...imageFiles]);

    imageFiles.forEach((file) => {
      file.preview = URL.createObjectURL(file);
    });

    if (onImagesSelected) {
      onImagesSelected([...selectedImages, ...imageFiles]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    if (onImagesSelected) {
      onImagesSelected(newImages);
    }
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 90) {
        clearInterval(interval);
      } else {
        setProgress(currentProgress);
      }
    }, 300);

    return () => clearInterval(interval);
  };

  const processImages = async () => {
    if (selectedImages.length === 0) {
      setError("Please select at least one image to process.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    const progressCleanup = simulateProgress();

    try {
      if (user) {
        await processImagesOnServer();
      } else {
        setError("Please log in to process images.");
        setIsProcessing(false);
        progressCleanup();
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Error processing images. Please try again.");
      setIsProcessing(false);
      progressCleanup();
    }
  };

  const processImagesOnServer = async () => {
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("userId", user.id);

      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/recipes/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Server returned ${response.status}: ${response.statusText}`
        );
      }

      setProgress(100);
      const data = await response.json();

      if (onRecipeExtracted) {
        onRecipeExtracted(data);
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Server processing error:", error);
      setError(`Server processing error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center py-6">
            <svg
              className="w-8 h-8 text-accent mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="text-sm text-gray-600">
              drag & drop cookbook images here, or click to select files
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For best results, use clear images with good lighting
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">
            Selected Images ({selectedImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file.preview || URL.createObjectURL(file)}
                  alt={`Recipe ${index}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={processImages}
              disabled={isProcessing}
              className={`w-full py-2 px-4 font-semibold rounded-md ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent text-white hover:bg-accent-dark"
              }`}
            >
              {isProcessing ? "Processing..." : "Extract Recipe"}
            </button>

            {isProcessing && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-accent h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-1">
                  {progress < 100
                    ? `Analyzing images... ${Math.round(progress)}%`
                    : "Finalizing recipe extraction..."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedImageUploader;

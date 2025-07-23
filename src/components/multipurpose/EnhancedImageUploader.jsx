import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { heicTo } from "heic-to"; // Using the correct heicTo function

function EnhancedImageUploader({ onImagesSelected, onRecipeExtracted }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { getToken, user } = useAuth();

  const API_BASE_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/heic",
    "image/heif",
  ];

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

  // Helper function to check if a file is HEIC/HEIF
  const checkIfHeicOrHeif = (file) => {
    // Check by file type
    if (
      file.type.toLowerCase() === "image/heic" ||
      file.type.toLowerCase() === "image/heif"
    ) {
      return true;
    }

    // Check by file extension if mime type is not set correctly
    const fileName = file.name.toLowerCase();
    return fileName.endsWith(".heic") || fileName.endsWith(".heif");
  };

  // Convert HEIC/HEIF to JPEG using heic-to library
  const convertHeicToJpeg = async (file) => {
    try {
      setIsConverting(true);

      try {
        // Use the heicTo function to convert the HEIC/HEIF file to JPEG

        const jpeg = await heicTo({
          blob: file,
          format: "image/jpeg", // Explicitly request JPEG format
          quality: 0.8, // Set quality to 80%
        });

        setIsConverting(false);
        return jpeg;
      } catch (conversionError) {
        console.error("heic-to conversion error:", conversionError);

        throw conversionError;
      }
    } catch (error) {
      console.error("HEIC/HEIF conversion error:", error);
      setIsConverting(false);

      // Mark the file as having failed conversion
      file.conversionFailed = true;
      return file;
    }
  };

  const processFile = async (file) => {
    try {
      // Check if file is a valid image type or has a valid extension
      const isValidImageType =
        validImageTypes.includes(file.type.toLowerCase()) ||
        checkIfHeicOrHeif(file);

      if (!isValidImageType) {
        console.warn(
          `File type ${file.type} for ${file.name} is not supported`
        );
        throw new Error(`File type not supported. Please upload images only.`);
      }

      // Convert HEIC/HEIF files to JPEG
      if (checkIfHeicOrHeif(file)) {
        const convertedFile = await convertHeicToJpeg(file);
        // If the file was converted successfully, it will already have a preview
        // If not, we'll create one if possible
        if (!convertedFile.preview && !convertedFile.conversionFailed) {
          convertedFile.preview = URL.createObjectURL(convertedFile);
        }
        return convertedFile;
      }

      // For other image types, just create the preview
      file.preview = URL.createObjectURL(file);
      return file;
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw error;
    }
  };

  const handleFiles = async (files) => {
    try {
      // Filter out non-image files
      const imageFiles = Array.from(files).filter((file) => {
        return (
          file.type.startsWith("image/") ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif")
        );
      });

      if (imageFiles.length === 0) {
        setError("No image files were selected. Please upload images only.");
        return;
      }

      // Check if there are HEIC/HEIF files
      const hasHeicFiles = imageFiles.some((file) => checkIfHeicOrHeif(file));

      if (hasHeicFiles) {
        setError("Converting HEIC/HEIF files... this may take a moment.");
      }

      // Show progress indicator for conversions
      if (hasHeicFiles) {
        setIsProcessing(true);
        setProgress(10);
      }

      // Process files one by one to avoid overwhelming the browser
      const processedFiles = [];
      let processedCount = 0;

      for (const file of imageFiles) {
        try {
          const processedFile = await processFile(file);
          processedFiles.push(processedFile);

          // Update progress for each processed file
          processedCount++;
          if (hasHeicFiles) {
            const progressValue =
              10 + Math.floor((processedCount / imageFiles.length) * 80);
            setProgress(progressValue);
          }
        } catch (error) {
          console.error("Error processing file:", error);
          setError(`Error processing ${file.name}: ${error.message}`);
          // Continue with other files
        }
      }

      if (processedFiles.length === 0) {
        setError("No valid image files could be processed.");
        setIsProcessing(false);
        return;
      }

      // Check for any failed conversions
      const failedConversions = processedFiles.filter(
        (file) => file.conversionFailed
      );

      if (failedConversions.length > 0) {
        setError(
          `${failedConversions.length} HEIC/HEIF file(s) couldn't be converted properly for preview. Please try another image format.`
        );
      } else if (hasHeicFiles) {
        // Clear the conversion message if successful
        setError(null);
      }

      // Update the state with the processed files
      setSelectedImages((prev) => [...prev, ...processedFiles]);

      // Call the callback if provided
      if (onImagesSelected) {
        onImagesSelected([...selectedImages, ...processedFiles]);
      }

      // Reset processing state
      setIsProcessing(false);
    } catch (error) {
      console.error("Error handling files:", error);
      setError(`Error handling files: ${error.message}`);
      setIsProcessing(false);
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

    // Get count of files that failed conversion
    const failedConversions = selectedImages.filter(
      (img) => img.conversionFailed
    ).length;

    if (failedConversions > 0) {
      // Ask user if they want to continue despite potential issues
      const confirmContinue = window.confirm(
        "Some HEIC/HEIF images couldn't be converted to JPEG format. This may cause issues with recipe extraction. Would you like to continue anyway? (For best results, consider using JPEG or PNG images instead)"
      );

      if (!confirmContinue) {
        return; // User chose to cancel
      }
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

      // Send each image and its metadata
      selectedImages.forEach((image, index) => {
        formData.append("images", image);

        // Add metadata about each file to help server processing
        formData.append(
          "imageMetadata",
          JSON.stringify({
            name: image.name,
            originalType: image.type,
            size: image.size,
            conversionFailed: !!image.conversionFailed,
          })
        );
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
              Supported formats: JPEG, PNG, GIF, HEIC, HEIF
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isConverting}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {isConverting && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-600 rounded-md text-sm">
          Converting HEIC image... Please wait...
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">
            selected images ({selectedImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                {file.conversionFailed ? (
                  <div className="h-24 w-full flex items-center justify-center rounded bg-gray-200">
                    <div className="text-xs text-center text-gray-600 p-1">
                      <svg
                        className="mx-auto h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {file.name}
                      <br />
                      (conversion failed)
                    </div>
                  </div>
                ) : (
                  <img
                    src={file.preview}
                    alt={`Recipe ${index}`}
                    className="h-24 w-full object-cover rounded"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      e.target.style.display = "none";
                      file.conversionFailed = true;
                      // Force a re-render
                      setSelectedImages([...selectedImages]);
                    }}
                  />
                )}
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
              disabled={isProcessing || isConverting}
              className={`w-full py-2 px-4 font-semibold rounded-md ${
                isProcessing || isConverting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent text-white hover:bg-accent-dark"
              }`}
            >
              {isProcessing ? "processing..." : "extract recipe"}
            </button>

            {(isProcessing || isConverting) && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-accent h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-1">
                  {isConverting
                    ? "converting image format..."
                    : progress < 100
                    ? `analyzing images... ${Math.round(progress)}%`
                    : "finalizing recipe extraction..."}
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

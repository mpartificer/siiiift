import "../App.css";
import { useState } from "react";
import CheckBox from "./multipurpose/CheckBox.jsx";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import SearchBar from "./multipurpose/SearchBar.jsx";
import BigSubmitButton from "./multipurpose/BigSubmitButton.jsx";

function RecipeCheckPanel(props) {
  const propInsert = props.propInsert;
  const myComponentList = propInsert.map((item, index) => (
    <li key={index}>{item}</li>
  ));

  return (
    <div className="recipeCheckPanel p-4">
      <RecipeCheckTitle recipeCheckTitle={props.confirmRecipeItem} />
      <ul className="recipeCheckPanelList w-full">{myComponentList}</ul>
      <CheckBox confirmRecipeItem={props.confirmRecipeItem} />
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

function ImageUploader({ onImagesSelected }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedImages([...selectedImages, ...imageFiles]);

    if (onImagesSelected) {
      onImagesSelected([...selectedImages, ...imageFiles]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    if (onImagesSelected) {
      onImagesSelected(newImages);
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

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <p className="font-medium mb-2">
            Selected Images ({selectedImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Recipe ${index}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InputSelector() {
  const [inputMethod, setInputMethod] = useState("url");
  const [images, setImages] = useState([]);

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
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
        <SearchBar placeholder="enter recipe url" />
      ) : (
        <ImageUploader onImagesSelected={handleImagesSelected} />
      )}
    </div>
  );
}

function WebsiteRetrievalView() {
  return (
    <div>
      <HeaderFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Recipe Extractor
          </h1>

          <InputSelector />

          <div className="space-y-4">
            <RecipeCheckPanel
              propInsert={["brownies"]}
              confirmRecipeItem="recipe title"
            />
            <RecipeCheckPanel
              propInsert={["sugar", "butter", "bread"]}
              confirmRecipeItem="ingredients"
            />
            <RecipeCheckPanel
              propInsert={["preheat oven", "roll out dough", "eat and enjoy"]}
              confirmRecipeItem="instructions"
            />
            <RecipeCheckPanel
              propInsert={["45 minutes"]}
              confirmRecipeItem="prep time"
            />
            <RecipeCheckPanel
              propInsert={["15 minutes"]}
              confirmRecipeItem="cook time"
            />
            <RecipeCheckPanel
              propInsert={["1 hour"]}
              confirmRecipeItem="total time"
            />
            <RecipeCheckPanel
              propInsert={["Sallys Baking Addiction"]}
              confirmRecipeItem="original author"
            />
            <RecipeCheckPanel
              propInsert={[""]}
              confirmRecipeItem="default image"
            />
          </div>

          <div className="mt-6">
            <BigSubmitButton submitValue="Extract Recipe" />
          </div>
        </div>
      </HeaderFooter>
    </div>
  );
}

export default WebsiteRetrievalView;

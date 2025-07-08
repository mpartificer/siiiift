import "../App.css";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import React, { useState, useEffect, useRef } from "react";
import SettingLogOut from "./multipurpose/SettingLogOut.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../AuthContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

function SettingsManagementView() {
  const location = useLocation();
  const userId = location.state?.userId;
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getToken } = useAuth();

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      setIsLoading(false);
      return;
    }

    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Your session has expired. Please log in again.");
        setIsLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Use the API endpoint to get user profile
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/profile`,
        config
      );

      if (response.data.success) {
        setUserDetails(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user details"
        );
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    // Update the local state with the new profile information
    setUserDetails((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  if (isLoading) {
    return (
      <div className="w-350 md:w-full">
        <HeaderFooter />
        <div className="flex justify-center items-center h-screen">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-350 md:w-full">
        <HeaderFooter />
        <div className="flex justify-center items-center h-screen">
          <div className="alert alert-error">
            <p>{error}</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-350 md:w-full">
      <HeaderFooter />
      <div className="flex flex-col md:flex-row gap-5 mb-14 mt-20 items-center md:items-start justify-self-center">
        <div className="flex flex-col flex-wrap justify-end">
          <div className="pageTitle text-xl md:text-3xl mb-1 justify-self-start md:self-end">
            {userDetails.username}
          </div>
          <EditBio
            userBio={userDetails.bio}
            photo={userDetails.photo}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
        <div className="flex flex-col w-350 gap-5 md:mt-8">
          <SettingLogOut settingName="log out" path="/login" />
        </div>
      </div>
    </div>
  );
}

const ImageUpload = ({ currentPhoto, onPhotoUpdate }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview for immediate visual feedback
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.put(
        `${API_BASE_URL}/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const publicUrl = response.data.data.photo;
        // Update parent component with new photo URL
        onPhotoUpdate?.(publicUrl);
      } else {
        throw new Error(response.data.message || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      // Handle error appropriately
    } finally {
      setUploading(false);
      setPreviewUrl(null); // Clear preview after upload completes
    }
  };

  return (
    <div className="relative">
      <img
        src={previewUrl || currentPhoto}
        alt="profile"
        className="w-36 h-36 md:w-80 md:h-80 standardBorder object-cover"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-2 right-2 rounded-full bg-primary p-2 hover:bg-primary-focus"
        disabled={uploading}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}
    </div>
  );
};

function TextAreaWithButton({ userBio, onBioUpdate }) {
  // Initialize state with userBio prop
  const [isUpdating, setIsUpdating] = useState(false);
  const [bio, setBio] = useState(userBio || "");
  const { getToken } = useAuth();

  // Update local state when userBio prop changes
  useEffect(() => {
    setBio(userBio || "");
  }, [userBio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await axios.put(
        `${API_BASE_URL}/profile/bio`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update parent component if needed
        onBioUpdate?.(bio);
      } else {
        throw new Error(response.data.message || "Failed to update bio");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      // Handle error appropriately
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="input input-bordered flex items-center gap-2 bg-secondary profileBlurb h-full md:w-80">
        <textarea
          className="textarea grow h-full w-full overflow-x-hidden bg-secondary"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary self-end justify-self-end"
          disabled={isUpdating}
        >
          {isUpdating ? "saving..." : "save"}
        </button>
      </label>
    </form>
  );
}

function EditBio({ userBio, photo, onProfileUpdate }) {
  const [currentBio, setCurrentBio] = useState(userBio);
  const [currentPhoto, setCurrentPhoto] = useState(photo);

  const handleBioUpdate = (newBio) => {
    setCurrentBio(newBio);
    onProfileUpdate?.({ bio: newBio, photo: currentPhoto });
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setCurrentPhoto(newPhotoUrl);
    onProfileUpdate?.({ bio: currentBio, photo: newPhotoUrl });
  };

  return (
    <div className="flex flex-row md:flex-col md:items-end w-350 gap-1 md:gap-4">
      <ImageUpload
        currentPhoto={currentPhoto}
        onPhotoUpdate={handlePhotoUpdate}
      />
      <TextAreaWithButton userBio={currentBio} onBioUpdate={handleBioUpdate} />
    </div>
  );
}

export default SettingsManagementView;

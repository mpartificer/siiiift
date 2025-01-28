import '../App.css'
import HeaderFooter from './multipurpose/HeaderFooter.jsx'
import React, { useState, useEffect, useRef } from 'react'
import SettingLogOut from './multipurpose/SettingLogOut.jsx'
import { useNavigate, useLocation  } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { Plus } from 'lucide-react';


const ImageUpload = ({ currentPhoto, userId, onPhotoUpdate }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('Bake_Image')
        .upload(`profiles/${fileName}`, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
      .from('Bake_Image')
      .getPublicUrl(`profiles/${fileName}`);
    
    
      console.log('Generated public URL:', publicUrl);

    console.log('Updating photo for user:', userId);
    
    const { data: updateData, error: updateError } = await supabase
    .from('user_profile')
    .update({ photo: publicUrl })
    .eq('user_auth_id', userId)
    .select(); // Add this to get back the updated record
  
  console.log('Update response data:', updateData);
  
  if (updateError) {
    console.error('Error updating user_profile:', updateError);
    throw updateError;
  } else {
    console.log('Successfully updated user_profile with new photo URL');
  }

  const { data: verifyData, error: verifyError } = await supabase
  .from('user_profile')
  .select('photo')
  .eq('user_auth_id', userId)
  .single();

console.log('Current photo URL in database:', verifyData?.photo);

      onPhotoUpdate?.(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      setPreviewUrl(null);
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

function EditBio(props) {
    return (
      <div className='flex flex-row md:flex-col md:items-end w-350 gap-1 md:gap-4'>
        <ImageUpload 
  currentPhoto={props.photo}
  userId={props.userId}
  onPhotoUpdate={(newUrl) => {
    props.onPhotoUpdate?.(newUrl);

    // Update local state if needed
  }}
/>
        <TextAreaWithButton userBio={props.userBio} />
      </div>
    )
  }

  function TextAreaWithButton(props) {
    let [userBio, setUserBio] = useState('')
    userBio = props.userBio

    let textArea = <textarea className="textarea grow h-full w-full overflow-x-hidden bg-secondary" value={userBio} onChange={(e) => setUserBio(e.target.value)}></textarea>

    const handleSubmit = (e) => {
      e.preventDefault()
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2 bg-secondary profileBlurb h-full md:w-80">
          {textArea}          
          <button type="submit"className='btn btn-primary self-end justify-self-end'>save</button>
        </label>
      </form>
    )
  }


function SettingsManagementView(props) {

  const location = useLocation();
  const userId = location.state.userId;

  const [userDetails, setUserDetails] = useState('');
  const [isLoading, setIsLoading] = useState('true')

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_auth_id', userId)
        .single();

      if (error) throw error;

      setUserDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user_profile:', error);
      setIsLoading(false);
    }
  };

    return (
      <div className='w-350 md:w-full'>
        <HeaderFooter />
          <div className="flex flex-col md:flex-row gap-5 mt-14 mb-14 md:mt-20 items-center md:items-start justify-self-center">
            <div className="flex flex-col flex-wrap justify-end">
              <div className='pageTitle text-xl md:text-3xl mb-1 justify-self-start md:self-end'>{userDetails.username}</div>
              <EditBio userBio={userDetails.bio} photo={userDetails.photo} userId={userId}/>            </div>
            <div className="flex flex-col w-350 gap-5 md:mt-8">
              <SettingLogOut settingName='log out' path='/login'/>
            </div>
          </div>
      </div>
    )
  }

  export default SettingsManagementView
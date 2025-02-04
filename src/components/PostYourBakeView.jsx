import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import RecipeDropDown from './multipurpose/RecipeDropDown.jsx';
import heic2any from 'heic2any';
import { addGlobalToast } from './multipurpose/ToastManager.jsx';
import { Loader2 } from 'lucide-react'

function ModificationRating() {
  const { control } = useFormContext();
  
  return (
    <div className='profilePlateTop'>
      <div className='recipeCheckTitle'>rate: </div>
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
    <div className='profilePlateTop'>
      <div className='recipeCheckTitle'>date of bake:</div>
      <Controller
        name="bakeDate"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            type="date"
            {...field}
            className='w-full dateEntry bg-secondary'
          />
        )}
      />
    </div>
  );
}

function PostYourBakeView() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isUploading, setIsUploading] = useState(false);
  const [currentBakeId, setCurrentBakeId] = useState(null);
  
  const methods = useForm({
    defaultValues: {
      rating: 0,
      bakeDate: '',
      recipeId: '',
      recipeTitle: '',
      ingredientModifications: [{
        originalIngredient: '',
        modifiedIngredient: ''
      }],
      instructionModifications: [{
        originalInstruction: '',
        modifiedInstruction: ''
      }]
    }
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function convertHeicToJpeg(file) {
    try {
      const jpegBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      return new File([jpegBlob], 
        file.name.replace(/\.heic$/i, '.jpg'), 
        { type: 'image/jpeg' }
      );
    } catch (error) {
      console.error('Error converting HEIC file:', error);
      throw new Error('Failed to convert HEIC file');
    }
  }

  const handleFile = async (e) => {
    setMessage("");
    let files = Array.from(e.target.files);
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/heic'];
    
    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const fileType = file.type.toLowerCase();
          
          if (!validImageTypes.includes(fileType)) {
            throw new Error("Only images accepted");
          }
          
          if (fileType === 'image/heic') {
            return await convertHeicToJpeg(file);
          }
          
          return file;
        })
      );
      
      setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeImage = (i) => {
    setFiles(files.filter(x => x.name !== i));
  };

  const PostImageUpload = () => {
    return (
      <div className="w-5/6 md:w-full md:max-w-sm flex-shrink-0">
        <div className="rounded-lg shadow-xl bg-primary">
          <div className="m-4 md:mt-0">
            <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">{message}</span>
            <div className="flex w-full">
              <label className="flex cursor-pointer flex-col w-full h-64 md:h-96 border-2 rounded-md border-dashed hover:bg-secondary">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd" />
                  </svg>
                  <p className="p-3 text-center text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    select a photo of your bake - we recommend a nice cross-section so we can examine all the layers and textures</p>
                </div>
                <input type="file" onChange={handleFile} className="opacity-0" multiple="multiple" name="files[]" />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, key) => (
                <div key={key} className="overflow-hidden relative">
                  <i onClick={() => { removeImage(file.name) }} className="mdi mdi-close absolute right-1 hover:text-white cursor-pointer"></i>
                  <img className="h-20 w-20 rounded-md" src={URL.createObjectURL(file)} />
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
      // Upload images and create bake record
      const imageUrls = [];
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase
          .storage
          .from('Bake_Image')
          .upload(fileName, file);
  
        if (error) throw error;
  
        const { data: { publicUrl }, error: urlError } = supabase
          .storage
          .from('Bake_Image')
          .getPublicUrl(fileName);
  
        if (urlError) throw urlError;
  
        imageUrls.push(publicUrl);
      }


  
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('username')
      .eq('user_auth_id', user.id)
      .single();

    if (profileError) throw profileError;
  
      // Create bake record
      const { data: bakeData, error: insertError } = await supabase
        .from('Bake_Details')
        .insert({
          user_id: user.id,
          recipe_id: formData.recipeId,
          recipe_title: formData.recipeTitle,
          photos: imageUrls,
          rating: formData.rating,
          baked_at: formData.bakeDate
        })
        .select();
  
      if (insertError) throw insertError;
  
      const bake_id = bakeData[0].id;
      setCurrentBakeId(bake_id);
  
      // Handle modifications
      const validIngredientMods = formData.ingredientModifications.filter(
        mod => mod.originalIngredient && mod.modifiedIngredient
      );
      const validInstructionMods = formData.instructionModifications.filter(
        mod => mod.originalInstruction && mod.modifiedInstruction
      );
  
      if (validIngredientMods.length > 0 || validInstructionMods.length > 0) {
        const modificationInserts = [
          ...validIngredientMods.map(mod => ({
            user_id: user.id,
            bake_id: bake_id,
            type: 'ingredient',
            original_step_text: mod.originalIngredient,
            updated_step: mod.modifiedIngredient,
            recipe_id: formData.recipeId
          })),
          ...validInstructionMods.map(mod => ({
            user_id: user.id,
            bake_id: bake_id,
            type: 'instruction',
            original_step_text: mod.originalInstruction,
            updated_step: mod.modifiedInstruction,
            recipe_id: formData.recipeId
          }))
        ];
  
        const { error: modInsertError } = await supabase
          .from('modifications')
          .insert(modificationInserts);
  
        if (modInsertError) throw modInsertError;
      }

      addGlobalToast({
        type: 'loading',
        message: 'analyzing your bake... (this may take a few minutes)'
      });
  
      // Reset form and navigate
      setFiles([]);
      methods.reset();
      navigate('/');

  
      // Start AI analysis in background
      const { data: { session } } = await supabase.auth.getSession();

      
      // Prepare AI payload
      const aiPayload = {
        imageUrls,
        recipeTitle: formData.recipeTitle,
        hasModifications: validIngredientMods.length > 0 || validInstructionMods.length > 0,
        originalInstructions: validInstructionMods.map(m => m.originalInstruction),
        modifiedInstructions: validInstructionMods.map(m => m.modifiedInstruction),
        originalIngredients: validIngredientMods.map(m => m.originalIngredient),
        modifiedIngredients: validIngredientMods.map(m => m.modifiedIngredient)
      };
  
      // Send AI analysis request
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-bake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(aiPayload)
      })
      .then(async (response) => {
        if (!response.ok) throw new Error('AI analysis failed');
        const { insights } = await response.json();
        
        // Update bake record with AI insights
        const { error: updateError } = await supabase
          .from('Bake_Details')
          .update({ ai_insights: insights })
          .eq('id', bake_id);


        if (updateError) throw updateError;
        // Show success toast with link
        addGlobalToast({
          type: 'success',
          message: 'AI analysis complete!',
          link: `/${profileData.username}/${formData.recipeId}`  // Make sure we have the correct user ID
        });
      })
      

      .catch(error => {
        console.error('AI Analysis Error:', error);
        if (error.response) {
          // Get more details about the HTTP error
          error.response.text().then(text => {
            console.error('Edge function response:', text);
          });
        }
        addGlobalToast({
          type: 'error',
          message: 'failed to complete AI analysis. you can still view your bake post.'
        });
      });
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <HeaderFooter>
      {windowWidth > 768 ? (
        <FormProvider {...methods}>
          <form className='websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden' 
                onSubmit={methods.handleSubmit(onSubmit)}>
            <RecipeDropDown />
            <div className="flex flex-col">
              <PostImageUpload />
              <ModificationRating />
              <BakePostDate />
              <button 
  type="submit" 
  className='bigSubmitButton' 
  disabled={isUploading}
>
  {isUploading ? (
    <div className="flex items-center justify-center w-full gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>uploading...</span>
    </div>
  ) : (
    'post'
  )}
</button>
              {error && <div className="error">{error}</div>}
              {message && <div className="success">{message}</div>}
            </div>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...methods}>
          <form className='websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden' 
                onSubmit={methods.handleSubmit(onSubmit)}>
            <PostImageUpload />
            <div className="w-full items-center md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
              <RecipeDropDown />
              <ModificationRating />
              <BakePostDate />
              <button 
  type="submit" 
  className='bigSubmitButton' 
  disabled={isUploading}
>
  {isUploading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>uploading...</span>
    </div>
  ) : (
    'post'
  )}
</button>              {error && <div className="error">{error}</div>}
              {message && <div className="success">{message}</div>}
            </div>
          </form>
        </FormProvider>
      )}
    </HeaderFooter>
  );
}

export default PostYourBakeView;
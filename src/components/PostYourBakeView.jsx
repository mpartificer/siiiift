import '../App.css'
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import HeaderFooter from './multipurpose/HeaderFooter.jsx'
import RecipeDropDown from './multipurpose/RecipeDropDown.jsx'
import heic2any from 'heic2any';


function ModificationRating({ rating, setRating }) {
    return (
      <div className='profilePlateTop'>
        <div className='recipeCheckTitle'>rate: </div>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <input
              key={value}
              type="radio"
              name="rating-1"
              className="mask mask-star"
              checked={rating === value}
              onChange={() => setRating(value)}
            />
          ))}
        </div>
      </div>
    )
}

function BakePostDate({ bakeDate, setBakeDate }) {
    return (
      <div className='profilePlateTop'>
        <div className='recipeCheckTitle'>date of bake:</div>
        <input
          type="date"
          value={bakeDate}
          onChange={(e) => setBakeDate(e.target.value)}
          className='w-full dateEntry bg-secondary'
        />
      </div>
    )
}

function PostYourBakeView() {


  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [bakeDate, setBakeDate] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [ingredientModifications, setIngredientModifications] = useState([{
    originalIngredient: '',
    modifiedIngredient: ''
}]);

const [instructionModifications, setInstructionModifications] = useState([{
    originalInstruction: '',
    modifiedInstruction: ''
}]);
  const [error, setError] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

// Function to convert HEIC file to JPEG
async function convertHeicToJpeg(file) {
  try {
    // Convert HEIC to JPEG blob
    const jpegBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    });

    // Create a new File object from the blob
    return new File([jpegBlob], 
      file.name.replace(/\.heic$/i, '.jpg'), 
      { type: 'image/jpeg' }
    );
  } catch (error) {
    console.error('Error converting HEIC file:', error);
    throw new Error('Failed to convert HEIC file');
  }
}

// Modified handleFile function
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
        
        // Convert HEIC files to JPEG
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
  }


  const PostImageUpload = () => {
    return (
      <div className="w-5/6 md:w-full flex-shrink-0">
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
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    Select a photo</p>
                </div>
                <input type="file" onChange={handleFile} className="opacity-0" multiple="multiple" name="files[]" />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, key) => {
                return (
                  <div key={key} className="overflow-hidden relative">
                    <i onClick={() => { removeImage(file.name) }} className="mdi mdi-close absolute right-1 hover:text-white cursor-pointer"></i>
                    <img className="h-20 w-20 rounded-md" src={URL.createObjectURL(file)} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const PostYourBake = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      // 1. Upload images to 'Bake_Image' bucket
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

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-bake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          // ^ this should be an access token
        },
        body: JSON.stringify({
          imageUrls,
          recipeTitle,
          originalInstructions: instructionModifications.map(m => m.originalInstruction),
          modifiedInstructions: instructionModifications.map(m => m.modifiedInstruction),
          originalIngredients: ingredientModifications.map(m => m.originalIngredient),
          modifiedIngredients: ingredientModifications.map(m => m.modifiedIngredient)
        })
      });
  
      const { insights } = await response.json();

      console.log(insights)
  
      // 2. Get the user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      console.log(recipeId)
  
      // 3. Insert data into Bake_Details table
      const { data: bakeData, error: insertError } = await supabase
        .from('Bake_Details')
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
          recipe_title: recipeTitle, // Add this line
          photos: imageUrls,
          rating: rating,
          baked_at: bakeDate,
          ai_insights: insights 
        })
        .select();
  
      if (insertError) throw insertError;
  
      const bake_id = bakeData[0].id;
  
      // 4. Insert modifications into modifications table
      const modificationInserts = [];
      
      // Handle ingredient modifications
      ingredientModifications.forEach(mod => {
        if (mod.originalIngredient && mod.modifiedIngredient) {
            modificationInserts.push({
                user_id: user.id,
                bake_id: bake_id,
                type: 'ingredient',
                original_step_text: mod.originalIngredient,
                updated_step: mod.modifiedIngredient
            });
        }
      });

      // Handle instruction modifications
      instructionModifications.forEach(mod => {
        if (mod.originalInstruction && mod.modifiedInstruction) {
            modificationInserts.push({
                user_id: user.id,
                bake_id: bake_id,
                type: 'instruction',
                original_step_text: mod.originalInstruction,
                updated_step: mod.modifiedInstruction
            });
        }
      });
  
      if (modificationInserts.length > 0) {
        const { error: modInsertError } = await supabase
            .from('modifications')
            .insert(modificationInserts);
    
        if (modInsertError) throw modInsertError;
    }
  
      // Clear form and show success message
      setFiles([]);
      setRating(0);
      setBakeDate('');
      setRecipeId(null);
      setRecipeTitle(''); // Add this line
      setIngredientModifications([]);
      setInstructionModifications([]);
      setMessage('Bake posted successfully!');
      navigate('/');
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  }

  return (
<HeaderFooter>
      {windowWidth > 768 ? (
              <form className='websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden' onSubmit={PostYourBake}>

<RecipeDropDown
    setRecipeId={setRecipeId}
    setRecipeTitle={setRecipeTitle}
    setIngredientModifications={setIngredientModifications}
    setInstructionModifications={setInstructionModifications}
    instructionModifications={instructionModifications}
    ingredientModifications={ingredientModifications}
  />
<div className="flex flex-col">
<PostImageUpload />

  <ModificationRating rating={rating} setRating={setRating} />
  <BakePostDate bakeDate={bakeDate} setBakeDate={setBakeDate} />
  <button type="submit" className='bigSubmitButton'>post</button>
  {error && <div className="error">{error}</div>}
  {message && <div className="success">{message}</div>}
  </div>
        </form>
      ) : (
        <form className='websiteRetrievalView mt-16 mb-16 md:flex md:flex-row md:gap-8 md:justify-center md:items-start overflow-hidden' onSubmit={PostYourBake}>

<PostImageUpload />

<div className="w-full items-center md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
  <RecipeDropDown
    setRecipeId={setRecipeId}
    setRecipeTitle={setRecipeTitle}
    setIngredientModifications={setIngredientModifications}
    setInstructionModifications={setInstructionModifications}
    instructionModifications={instructionModifications}
    ingredientModifications={ingredientModifications}
  />
  <ModificationRating rating={rating} setRating={setRating} />
  <BakePostDate bakeDate={bakeDate} setBakeDate={setBakeDate} />
  <button type="submit" className='bigSubmitButton'>post</button>
  {error && <div className="error">{error}</div>}
  {message && <div className="success">{message}</div>}
</div>
</form>
      )}

    </HeaderFooter>

  )
}

export default PostYourBakeView
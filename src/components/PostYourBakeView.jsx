import '../App.css'
import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import RecipeDropDown from './multipurpose/RecipeDropDown.jsx'

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
  const [modifications, setModifications] = useState({ ingredients: [], instructions: [] });
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    setMessage("");
    let file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]['type'];
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (validImageTypes.includes(fileType)) {
        setFiles(prevFiles => [...prevFiles, file[i]]);
      } else {
        setMessage("only images accepted");
      }
    }
  };

  const removeImage = (i) => {
    setFiles(files.filter(x => x.name !== i));
  }

  const PostImageUpload = () => {
    return (
      <div className="flex justify-center items-center px-3">
        <div className="rounded-lg shadow-xl bg-primary md:w-1/2 w-350">
          <div className="m-4">
            <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">{message}</span>
            <div className="flex w-full">
              <label className="flex cursor-pointer flex-col w-full h-32 border-2 rounded-md border-dashed hover:bg-secondary">
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
          baked_at: bakeDate
        })
        .select();
  
      if (insertError) throw insertError;
  
      const bake_id = bakeData[0].id;
  
      // 4. Insert modifications into modifications table
      const modificationInserts = [];
      
      // Handle ingredient modifications
      modifications.ingredients.forEach(mod => {
        modificationInserts.push({
          bake_id: bake_id,
          type: 'ingredient',
          original_step_text: mod.originalIngredient,
          updated_step: mod.modifiedIngredient
        });
      });
  
      // Handle instruction modifications
      modifications.instructions.forEach(mod => {
        modificationInserts.push({
          bake_id: bake_id,
          type: 'instruction',
          original_step_text: mod.originalInstruction,
          updated_step: mod.modifiedInstruction
        });
      });
  
      const { error: modInsertError } = await supabase
        .from('modifications')
        .insert(modificationInserts);
  
      if (modInsertError) throw modInsertError;
  
      // Clear form and show success message
      setFiles([]);
      setRating(0);
      setBakeDate('');
      setRecipeId(null);
      setRecipeTitle(''); // Add this line
      setModifications({ ingredients: [], instructions: [] });
      setMessage('Bake posted successfully!');
      navigate('/');
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  }

  return (
    <form className='websiteRetrievalView' onSubmit={PostYourBake}>
      <Header />
      <PostImageUpload />
      <RecipeDropDown
        setRecipeId={setRecipeId}
        setRecipeTitle={setRecipeTitle}
        setModifications={setModifications}
      />
      <ModificationRating rating={rating} setRating={setRating} />
      <BakePostDate bakeDate={bakeDate} setBakeDate={setBakeDate} />
      <button type="submit" className='bigSubmitButton'>post</button>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <Footer />
    </form>
  )
}

export default PostYourBakeView
import '../App.css'
import React from 'react'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import RecipeDropDown from './multipurpose/RecipeDropDown.jsx'

  
function ModificationRating() {
    return (
      <div className='profilePlateTop'>
        <div className='recipeCheckTitle'>rate: </div>
        <ModificationRatingSystem />
      </div>
    )
}
  
function ModificationRatingSystem() {
    return (
      <div className="rating">
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" defaultChecked />
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" />
      </div>
    )
}
  
function BakePostDate() {
    return (
      <div className='profilePlateTop'>
        <div className='recipeCheckTitle'>date of bake:</div>
        <input type="text" placeholder="mo." className='w-1/4 dayMonthDateEntry'/>
        <input type="text" placeholder="day" className='w-1/4 dayMonthDateEntry'/>
        <input type="text" placeholder="year" className='w-1/2 yearDateEntry' />
      </div>
    )
}



function PostYourBakeView() {

  const { useState } = React;
  const [files, setFile] = useState([]);
  const [message, setMessage] = useState();
  const PostImageUpload = () => {

      const handleFile = (e) => {
          setMessage("");
          let file = e.target.files;
  
          for (let i = 0; i < file.length; i++) {
              const fileType = file[i]['type'];
              const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
              if (validImageTypes.includes(fileType)) {
                  setFile([...files, file[i]]);
              } else {
                  setMessage("only images accepted");
              }
  
          }
      }; 
  
      const removeImage = (i) => {
          setFile(files.filter(x => x.name !== i));
       }
  
  
      return (
          <>
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
          </>
      );
  }

  console.log(files)
  const PostYourBake = async () => {
    try{

    const { data, error } = await supabase
      .storage
      .from('Bake_image')
      .upload('', files, {
        cacheControl: '3600',
        upsert: false
  })

    if (error) throw error
    
    }
    catch (err) {
      console.error('Error:', err)
      setError(err.message)
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
    }
    catch(err) {
      console.error('Error:', err)
      setError(err.message)
    }
      
    try {
      const { error } = await supabase
        .from('Bake_Details')
        .insert({ name: 'Denmark' })

    }
    catch (err) {
      console.error('Error:', err)
      setError(err.message)
    }

  }
    return (
      <form className='websiteRetrievalView' onSubmit={PostYourBake}>
        <Header />
        <PostImageUpload />
        <RecipeDropDown />
        <ModificationRating />
        <BakePostDate />
        <button type="submit" className='bigSubmitButton'>post</button>
        <Footer />
      </form>
    )
}

export default PostYourBakeView
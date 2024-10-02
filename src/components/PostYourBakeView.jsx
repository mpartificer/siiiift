import '../App.css'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import RecipeDropDown from './multipurpose/RecipeDropDown.jsx'
import PostImageUpload from './multipurpose/PostImageUpload.jsx'

  
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

  const PostYourBake = async () => {
    try{
    const avatarFile = event.target.files[0]

    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload('public/avatar1.png', avatarFile, {
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
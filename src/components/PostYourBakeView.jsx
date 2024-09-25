import '../App.css'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import Header from './multipurpose/Header.jsx'
import { Image } from 'lucide-react'
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
    return (
      <div className='websiteRetrievalView'>
        <Header />
        <Image size={300} />
        <RecipeDropDown />
        <ModificationRating />
        <BakePostDate />
        <BigSubmitButton submitValue='post' path='/' />
        <Footer />
      </div>
    )
}

export default PostYourBakeView
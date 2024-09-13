import '../App.css'
import PageTitle from './multipurpose/PageTitle.jsx'
import { Plus } from 'lucide-react'
import Toggle from './multipurpose/Toggle.jsx'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import RecipeCard from './multipurpose/RecipeCard.jsx'





function RecipeBoxHeader() {
    const navigate = useNavigate();
    return (
      <div className='profilePlateTop'>
        <PageTitle pageTitle='usernames recipe box' />
        <Plus size={30} color='#192F01' onClick={() => navigate('/reciperetriever')}/>
      </div>
    )
}
  
function RecipeBoxSubHeader() {
    return (
      <div className='flex flex-row justify-between items-center w-350'>
        <ToggleBox />
        <SortByBox />
      </div>
    )
}

function ToggleBox() {
    return (
      <div className='flex flex-row gap-2'>
        <Toggle justify='justify-start' />
        filter by attempted
      </div>
    )
}
  
function SortByBox() {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1 bg-secondary">sort by</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
    )
  }




function RecipeBoxView() {
    return (
      <div className='followersView'>
        <Header />
        <RecipeBoxHeader />
        <RecipeBoxSubHeader />
        <RecipeCard />
        <Footer />
      </div>
    )
  }

  export default RecipeBoxView
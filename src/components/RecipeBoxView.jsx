import '../App.css'
import PageTitle from './multipurpose/PageTitle.jsx'
import { Plus } from 'lucide-react'
import Toggle from './multipurpose/Toggle.jsx'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { useNavigate } from 'react-router-dom'




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
      <div className='profilePlateTop'>
        <ToggleBox />
        <SortByBox />
      </div>
    )
}

function ToggleBox() {
    return (
      <div>
        <Toggle justify='justify-start' />
        filter by attempted
      </div>
    )
}
  
function SortByBox() {
    return (
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">sort by</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
    )
  }

function RecipeCard() {
    const navigate = useNavigate()
    return (
      <div className="card card-side bg-base-100 shadow-xl max-w-350">
        <figure>
          <img
            src="src/assets/TempImage.jpg"
            alt="recipe image" className='recipeBoxCardImg' />
        </figure>
        <div className="card-body">
          <h2 className="card-title">brownies</h2>
          <p>ready in 45 minutes</p>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary" onClick={() => navigate('/recipeid')}>Watch</button>
          </div>
        </div>
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
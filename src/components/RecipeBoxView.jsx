import '../App.css'
import PageTitle from './multipurpose/PageTitle.jsx'
import { Plus } from 'lucide-react'
import Toggle from './multipurpose/Toggle.jsx'
import Header from './multipurpose/Header.jsx'




function RecipeBoxHeader() {
    return (
      <div className='profilePlateTop'>
        <PageTitle pageTitle='usernames recipe box' />
        <Plus size={30} color='#192F01' />
      </div>
    )
}
  
function RecipeBoxSubHeader() {
    return (
      <div className='profilePlateTop standardMargins'>
        <ToggleBox />
        <SortByBox />
      </div>
    )
}

function ToggleBox() {
    return (
      <div>
        <Toggle />
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
    return (
      <div className="card card-side bg-base-100 shadow-xl max-w-96 standardMargins">
        <figure>
          <img
            src="https://cakesbymk.com/wp-content/uploads/2023/01/Template-Size-for-Blog-Photos-15-802x1024.jpg"
            alt="recipe image" className='recipeBoxCardImg' />
        </figure>
        <div className="card-body">
          <h2 className="card-title">brownies</h2>
          <p>ready in 45 minutes</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Watch</button>
          </div>
        </div>
      </div>
    )
  }


function RecipeBoxView() {
    return (
      <div>
        <Header />
        <RecipeBoxHeader />
        <RecipeBoxSubHeader />
        <RecipeCard />
      </div>
    )
  }

  export default RecipeBoxView
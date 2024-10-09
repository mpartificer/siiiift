import { useNavigate } from 'react-router-dom';
import '../../App.css';

function RecipeCard(props) {
    const navigate = useNavigate()

    const recipeData = { "recipeName" : props.recipeTitle, "recipeId" : props.recipeId}
    const toRecipeProfile =() => {
      navigate(`/recipe/${props.recipeId}`, {state: recipeData})
    }

    return (
      <div className="card card-side bg-base-100 shadow-xl w-350 standardBorder overflow-hidden mt-1.5" onClick={()=>{toRecipeProfile()}}>
        <figure>
          <img
            src={props.photo}
            alt="recipe image" className='recipeBoxCardImg' />
        </figure>
        <div className="card-body card-compact bg-primary overflow-hidden text-secondary p-4.5">
          <h2 className="card-title">{props.recipeTitle}</h2>
          <p>ready in {props.totalTime} </p>
        </div>
      </div>
    )
}

export default RecipeCard
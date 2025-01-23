import { useNavigate } from 'react-router-dom';
import '../../App.css';

function RecipeCard(props) {
    const navigate = useNavigate()

    const recipeData = { "recipeName" : props.recipeTitle, "recipeId" : props.recipeId}
    const toRecipeProfile =() => {
      navigate(`/recipe/${props.recipeId}`, {state: recipeData})
    }

    return (
      <div className="card card-side bg-base-100 shadow-xl w-full standardBorder border-2 border-primary overflow-hidden mt-1.5 hover:cursor-pointer" onClick={()=>{toRecipeProfile()}}>
        <figure className="w-1/3">
          <img
            src={props.photo}
            alt="recipe image" 
            className='recipeBoxCardImg w-full h-full object-cover' />
        </figure>
        <div className="card-body card-compact bg-secondary overflow-hidden text-primary p-4 w-2/3">
          <h2 className="card-title ">{props.recipeTitle}</h2>
          <p>ready in {props.totalTime} </p>
        </div>
      </div>
    )
}

export default RecipeCard;
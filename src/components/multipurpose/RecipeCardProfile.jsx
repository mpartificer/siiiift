import { useNavigate } from "react-router-dom";
import "../../App.css";

const DEFAULT_IMAGE_URL =
  "https://iivozawppltyhsrkixlk.supabase.co/storage/v1/object/public/recipe-images//ChatGPT%20Image%20May%2019,%202025,%2003_17_24%20PM.png";

function RecipeCardProfile(props) {
  const navigate = useNavigate();

  const recipeData = {
    recipeName: props.recipeTitle,
    recipeId: props.recipeId,
  };
  const toRecipeProfile = () => {
    navigate(`/recipe/${props.recipeId}`, { state: recipeData });
  };

  return (
    <div
      className="card card-side bg-base-100 shadow-xl w-350 standardBorder border-2 border-primary overflow-hidden m-2 hover:cursor-pointer"
      onClick={() => {
        toRecipeProfile();
      }}
    >
      <figure className="w-1/3">
        <img
          src={props.photo || DEFAULT_IMAGE_URL}
          alt="recipe image"
          className="recipeBoxCardImg w-full h-full object-cover"
        />
      </figure>
      <div className="card-body card-compact bg-secondary overflow-hidden text-primary p-4 w-2/3">
        <h2 className="card-title ">{props.recipeTitle}</h2>
        <p>ready in {props.totalTime} </p>
      </div>
    </div>
  );
}

export default RecipeCardProfile;

import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient.js"

function RecipeCard(props) {
    const navigate = useNavigate()

    // const [recipeDetails, setRecipeDetails] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

  
    // useEffect(() => {
    //   let isMounted = true;
  
    //   async function fetchRecipeDetails() {
    //     try {
    //       const { data, error } = await supabase
    //         .from('recipe_profile')
    //         .select('*');
  
    //       if (error) throw error;
  
    //       if (isMounted) {
    //         setRecipeDetails(data);
    //         setIsLoading(false);
    //         console.log(recipeDetails)
    //       }
    //     } catch (error) {
    //       console.error('Error fetching recipe_profile:', error);
    //       if (isMounted) setIsLoading(false);
    //     }
    //   }
  
    // fetchRecipeDetails();
  
    //   return () => {
    //     isMounted = false;
    //   };

    // }, []);
  
    // if (isLoading) return <div>Loading...</div>;

    // if (!recipeDetails || recipeDetails.length === 0) return <div>No recipe details available</div>;

    // const recipeTitle = recipeDetails[0].title.toString();
    // const totalTime = recipeDetails[0].total_time.toString();
    // const recipeId = recipeDetails[0].id.toString();;

    // console.log(recipeDetails)
    // const photos = recipeDetails[0].images;


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
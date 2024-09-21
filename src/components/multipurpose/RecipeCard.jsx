import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient.js"

function RecipeCard() {
    const navigate = useNavigate()

    const [recipeDetails, setRecipeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  
    useEffect(() => {
      let isMounted = true;
  
      async function fetchRecipeDetails() {
        try {
          const { data, error } = await supabase
            .from('recipe_profile')
            .select('*');
  
          if (error) throw error;
  
          if (isMounted) {
            setRecipeDetails(data);
            setIsLoading(false);
            console.log(setRecipeDetails)
          }
        } catch (error) {
          console.error('Error fetching recipe_profile:', error);
          if (isMounted) setIsLoading(false);
        }
      }
  
    fetchRecipeDetails();
  
      return () => {
        isMounted = false;
      };

    }, []);
  
    if (isLoading) return <div>Loading...</div>;

    if (!recipeDetails || recipeDetails.length === 0) return <div>No recipe details available</div>;

    const recipeTitle = recipeDetails[0].title.toString();
    const totalTime = recipeDetails[0].total_time.toString();
    const photos = recipeDetails[0].photos;

    return (
      <div className="card card-side bg-base-100 shadow-xl w-350 standardBorder overflow-hidden">
        <figure>
          <img
            src={photos}
            alt="recipe image" className='recipeBoxCardImg' />
        </figure>
        <div className="card-body card-compact bg-primary overflow-hidden text-secondary h-full">
          <h2 className="card-title">{recipeTitle}</h2>
          <p>ready in {totalTime} minutes</p>
          <div className="card-actions justify-end">
            <button className="btn bg-accent" onClick={() => navigate('/recipeid')}>bake</button>
          </div>
        </div>
      </div>
    )
}

export default RecipeCard
import '../App.css'
import { Plus } from 'lucide-react'
import HeaderFooter from './multipurpose/HeaderFooter.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import RecipeCard from './multipurpose/RecipeCard.jsx'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

function RecipeBoxHeader({ username }) {
  const navigate = useNavigate();
  const pageTitle = `${username}'s recipe box`;
  return (
    <div className='w-full max-w-4xl flex flex-row justify-between items-center'>
      <div className='pageTitle text-xl'>{pageTitle}</div>
      <Plus size={30} color='#192F01' onClick={() => navigate('/reciperetriever')}/>
    </div>
  )
}

function RecipeBoxView() {
  const location = useLocation();
  const userId = location.state?.userId;

  const [userDetails, setUserDetails] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchUserAndRecipes() {
      if (!userId) {
        console.error('No userId provided');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('user_profile')
          .select('username')
          .eq('user_auth_id', userId)
          .single();

        if (userError) throw userError;

        // Fetch saved recipes from saves_view
        const { data: recipesData, error: recipesError } = await supabase
          .from('saves_view')
          .select(`
            recipe_id,
            recipe_title,
            recipe_images,
            total_time
          `)
          .eq('user_id', userId);

        if (recipesError) throw recipesError;

        setUserDetails(userData);
        setSavedRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserAndRecipes();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  const { username } = userDetails;

  return (
    <div>
      <HeaderFooter>
        {windowWidth > 768 ? (
          <div className='mt-16 mb-16 px-8 flex flex-col items-center w-full'>
            <RecipeBoxHeader username={username} />
            <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mt-8">
              {savedRecipes && savedRecipes.length > 0 ? (
                savedRecipes.map(recipe => (
                  <div key={recipe.recipe_id} className="flex justify-center">
                    <RecipeCard
                      recipeTitle={recipe.recipe_title}
                      totalTime={recipe.total_time}
                      recipeId={recipe.recipe_id}
                      photo={recipe.recipe_images?.[0]}
                    />
                  </div>
                ))
              ) : (
                <div>No saved recipes available</div>
              )}
            </div>
          </div>
        ) : (
          <div className='mt-16 mb-16 ml-2 mr-2 flex flex-col w-full'>
            <RecipeBoxHeader username={username} />
            <div className="flex flex-col gap-2 mt-4">
              {savedRecipes && savedRecipes.length > 0 ? (
                savedRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipeTitle={recipe.recipe_title}
                    totalTime={recipe.total_time}
                    recipeId={recipe.recipe_id}
                    photo={recipe.recipe_images?.[0]}
                  />
                ))
              ) : (
                <div>No saved recipes available</div>
              )}
            </div>
          </div>
        )}
      </HeaderFooter>
    </div>
  )
}

export default RecipeBoxView
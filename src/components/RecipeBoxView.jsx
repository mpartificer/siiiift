import '../App.css'
import { Plus, ArrowDownUp } from 'lucide-react'
import Toggle from './multipurpose/Toggle.jsx'
import HeaderFooter from './multipurpose/HeaderFooter.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import RecipeCard from './multipurpose/RecipeCard.jsx'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

function RecipeBoxHeader({ username }) {
  const navigate = useNavigate();
  const pageTitle = `${username}'s recipe box`;
  return (
    <div className='flex flex-row justify-between align-center sm:w-350 md:w-5/6 md:grow'>
      <div className='pageTitle'>{pageTitle}</div>
      <Plus size={30} color='#192F01' onClick={() => navigate('/reciperetriever')}/>
    </div>
  )
}

function RecipeBoxSubHeader() {
  return (
    <div className='flex flex-row justify-between items-center sm:w-350 md:w-5/6 md:grow'>
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
      <div tabIndex={0} role="button" className="btn m-1 bg-secondary"><ArrowDownUp /></div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
  )
}

function RecipeBoxView() {
  const location = useLocation();
  const userId = location.state?.userId;

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      if (!userId) {
        console.error('No userId provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_auth_id', userId)
          .single();

        if (error) throw error;

        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user_profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  const { username, recipes } = userDetails;

  return (
    <div>
    <HeaderFooter>
    <div className='sm:w-350 md:w-screen mt-16 mb-16 sm:ml-2 sm:mr-2 flex flex-column align-center flex-wrap'>
      <RecipeBoxHeader username={username} />
      <RecipeBoxSubHeader />
      {/* <div className="md:flex md:flex-row md:flex-wrap md:gap-4 md:justify-center"> */}
      <div className="md:grid-cols-2" >
      {recipes && recipes.length > 0 ? (
        recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipeTitle={recipe.recipetitle}
            totalTime={recipe.totaltime}
            recipeId={recipe.id}
            photo={recipe.photo}
          />
        ))
      ) : (
        <div>No recipes available</div>
      )}
      </div>
      </div>
      </HeaderFooter>
    </div>
  )
}

export default RecipeBoxView
import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { Settings } from 'lucide-react'
import { Cookie } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import HeaderFooter from '../components/multipurpose/HeaderFooter.jsx'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import HomeCard from './multipurpose/HomeCard.jsx'
import RecipeCard from './multipurpose/RecipeCard.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js'


function SettingsButton(props) {
  const navigate = useNavigate();

  const userData = { "userId": props.userId }

  const toUserSettings = () => {
    navigate(`/profile/settings`, { state: userData })}

    return(
      <div className='settingsButton'>
        <Settings size={24} color='#192F01' onClick={toUserSettings} />
      </div>
    )
}
  
function ProfileBlurb(props) {
    return (
      <div className='profileBlurb'>
        {props.profileDescription}
      </div>
    )
}
  
function ProfileSummary(props) {

    return (
      <div className='profileSummary md:w-80'>
        <FollowBar>
          <FollowTab number={props.followerCount} measure="followers" username={props.username} userId={props.userId} />
          <FollowTab number={props.followingCount} measure="following"  username={props.username} userId={props.userId} />
          <FollowTab number={props.bakes} measure="bakes" username={props.username} userId={props.userId} />
        </FollowBar>
        <ProfileBlurb profileDescription={props.userBio}/>
      </div>
    )
}
  
function ProfilePlateTop(props) {
    return (
      <div className='profilePlateTop text-xl md:max-w-80 md:justify-end'>
        {props.children}
      </div>
    )
}
  
function ProfilePlateBottom(props) {
    return (
      <div className='flex sm:flex-row md:flex-column flex-wrap gap-2 sm:w-350 md:justify-end'>
        {props.children}
      </div>
    )
}
  
function ProfilePlate(props) {
    return (
      <div className='profilePlate flex-1 sm:w-350 md:w-5/6'>
        <ProfilePlateTop>
        <div className='pageTitle text-xl'>{props.userName}</div>
        <SettingsButton userId={props.userId}/>
        </ProfilePlateTop>
        <ProfilePlateBottom>
        <img 
          src={props.photos}
          alt="recipe" 
          className='sm:max-w-36 sm:max-h-36 md:max-w-80 md:max-h-80 profileImg standardBorder'
        />
          <ProfileSummary bakes={props.bakes} followingCount={props.followingCount} followerCount={props.followerCount} username={props.userName} userId={props.userId} userBio={props.userBio}/>
        </ProfilePlateBottom>
      </div>
    )
}

function ContentCap({ userId }) {
  const [activeTab, setActiveTab] = useState('bakes');
  const [bakes, setBakes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    fetchBakes();
    fetchSavedRecipes();
  }, [userId]);

  const fetchBakes = async () => {
    const { data, error } = await supabase
      .from('Bake_Details')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bakes:', error);
    } else {
      setBakes(data);
    }
  };

  const fetchSavedRecipes = async () => {
    const { data, error } = await supabase
      .from('saves_view')
      .select('user_id, recipe_id, recipe_title, recipe_images, total_time')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching saved recipes:', error);
    } else {
      setSavedRecipes(data);
    }
  };

  return (
    <div className='flex-1'>
      <ul className="menu menu-horizontal bg-primary rounded-box mt-6 sm:w-350 md:w-5/6 justify-around">
        <li>
          <a
            className={`tooltip ${activeTab === 'bakes' ? 'active' : ''}`}
            data-tip="Bakes"
            onClick={() => setActiveTab('bakes')}
          >
            <Cookie />
          </a>
        </li>
        <li>
          <a
            className={`tooltip ${activeTab === 'recipes' ? 'active' : ''}`}
            data-tip="Saved Recipes"
            onClick={() => setActiveTab('recipes')}
          >
            <BookOpen />
          </a>
        </li>
      </ul>
      <div className="mt-4">
        {activeTab === 'bakes' && (
          <div className="grid grid-cols-1 gap-4">
            {bakes.map((bake) => (
              <HomeCard
                key={bake.id}
                pageTitle={[bake.username, bake.recipe_title]}
                photos={bake.photos}
                recipeId={bake.recipe_id}
                currentUserId={userId}
                bakeId={bake.id}
                userId={bake.user_id}
              />
            ))}
          </div>
        )}
        {activeTab === 'recipes' && (
          <div className="grid grid-cols-1 gap-4">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                recipeTitle={recipe.recipe_title}
                recipeId={recipe.recipe_id}
                photo={recipe.recipe_images}
                totalTime={recipe.total_time}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileView() {
  const location = useLocation();
  const userId = location.state.userId;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_auth_id', userId)
        .single();

      if (error) throw error;

      setUserDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user_profile:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  return (
    <div className='flex flex-column flex-nowrap justify-center'>
      <HeaderFooter>
        <div className='flex flex-column flex-nowrap mt-16 mb-16 justify-center'>
      <ProfilePlate
        userName={userDetails.username}
        followerCount={userDetails.follower_count}
        followingCount={userDetails.following_count}
        userBio={userDetails.bio}
        bakes={userDetails.bakes_count}
        recipes={userDetails.recipes_count}
        userId={userId}
        photos={userDetails.photo}
      />
      <ContentCap userId={userId} />
      </div>
      </HeaderFooter>
    </div>
  );
}

export default ProfileView;
import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { Settings } from 'lucide-react'
import { Cookie } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import HeaderFooter from '../components/multipurpose/HeaderFooter.jsx'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import HomeCardMobile from './multipurpose/HomeCardMobile.jsx'
import HomeCardDesktop from './multipurpose/HomeCardDesktop.jsx'
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
      <div className='flex flex-row md:flex-column flex-wrap gap-2 md:items-end w-350 md:justify-end'>
        {props.children}
      </div>
    )
}

function ProfilePlateMobile(props) {
  return (
    <div className='profilePlate flex-1 ml-2.5 mr-2.5 sm:w-350 md:w-5/6'>
      <ProfilePlateTop>
      <div className='pageTitle text-xl'>{props.userName}</div>
      <SettingsButton userId={props.userId}/>
      </ProfilePlateTop>
      <ProfilePlateBottom>
      <img 
        src={props.photos}
        alt="recipe" 
        className='sm:min-w-36 sm:min-h-36 md:min-w-80 md:min-h-80 object-cover standardBorder w-24 md:w-96 h-24 md:h-96 '
      />
        <ProfileSummary bakes={props.bakes} followingCount={props.followingCount} followerCount={props.followerCount} username={props.userName} userId={props.userId} userBio={props.userBio}/>
      </ProfilePlateBottom>
    </div>
  )
}
  
function ProfilePlateDesktop(props) {
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
          className='sm:min-w-36 sm:min-h-36 md:min-w-80 md:min-h-80 object-cover standardBorder recipeImg'
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <ul className="menu menu-horizontal bg-primary rounded-box mt-6 ml-2.5 w-350 md:w-5/6 justify-around">
        <li>      
            <a className={`tooltip ${activeTab === 'bakes' ? 'active' : ''}`}
            data-tip="Bakes"
            onClick={() => setActiveTab('bakes')}>
            <Cookie />
          </a>
        </li>
        <li>
          
            <a className={`tooltip ${activeTab === 'recipes' ? 'active' : ''}`}
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
              windowWidth > 768 ? (
                <HomeCardDesktop
                  key={bake.id}
                  pageTitle={[bake.username, bake.recipe_title]}
                  photos={bake.photos}
                  recipeId={bake.recipe_id}
                  currentUserId={userId}
                  bakeId={bake.id}
                  userId={bake.user_id}
                />
              ) : (
                <HomeCardMobile
                  key={bake.id}
                  pageTitle={[bake.username, bake.recipe_title]}
                  photos={bake.photos}
                  recipeId={bake.recipe_id}
                  currentUserId={userId}
                  bakeId={bake.id}
                  userId={bake.user_id}
                />
              )
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      // Fetch basic user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_auth_id', userId)
        .single();
  
      if (profileError) throw profileError;
  
      // Fetch bakes count
      const { data: bakesData, error: bakesError } = await supabase
        .from('bake_details_view')
        .select('bake_id')
        .eq('user_id', userId);
  
      if (bakesError) throw bakesError;
  
      // Fetch followers count
      const { data: followersData, error: followersError } = await supabase
        .from('user_followers_view')
        .select('follower_id')
        .eq('user_id', userId);
  
      if (followersError) throw followersError;
  
      // Fetch following count
      const { data: followingData, error: followingError } = await supabase
        .from('user_following_view')
        .select('following_id')
        .eq('user_id', userId);
  
      if (followingError) throw followingError;
  
      // Combine all data
      const userDetailsWithCounts = {
        ...profileData,
        bakes_count: bakesData?.length || 0,
        follower_count: followersData?.length || 0,
        following_count: followingData?.length || 0
      };
  
      setUserDetails(userDetailsWithCounts);
      setIsLoading(false);
  
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  return (
    <div className='flex flex-column flex-nowrap justify-center'>
      <HeaderFooter>
        {windowWidth > 768 ? (
          <div className='flex flex-column flex-nowrap mt-16 mb-16 justify-items-end'> {/* Added justify-end and items-end */}
            <ProfilePlateDesktop
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
        ) : (
          <div className='flex flex-column flex-wrap mt-16 mb-16 justify-center'>
            <ProfilePlateMobile
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
        )}
      </HeaderFooter>
    </div>
  );
}

export default ProfileView;
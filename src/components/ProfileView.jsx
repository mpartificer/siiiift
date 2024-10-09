import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import { Cookie } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import HomeCard from './multipurpose/HomeCard.jsx'
import RecipeCard from './multipurpose/RecipeCard.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js'


function SettingsButton() {
  const navigate = useNavigate();
    return(
      <div className='settingsButton'>
        <Settings size={24} color='#192F01' onClick={() => navigate('/profile/settings')} />
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
      <div className='profileSummary'>
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
      <div className='profilePlateTop'>
        {props.children}
      </div>
    )
}
  
function ProfilePlateBottom(props) {
    return (
      <div className='profilePlateBottom'>
        {props.children}
      </div>
    )
}
  
function ProfilePlate(props) {
  console.log(props.userName)
    return (
      <div className='profilePlate'>
        <ProfilePlateTop>
        <div className='pageTitle'>{props.userName}</div>
        <SettingsButton />
        </ProfilePlateTop>
        <ProfilePlateBottom>
          <User size={140} color='#192F01'/>
          <ProfileSummary bakes={props.bakes} followingCount={props.followingCount} followerCount={props.followerCount} username={props.userName} userId={props.userId} userBio={props.userBio}/>
        </ProfilePlateBottom>
      </div>
    )
}

function ContentCap(props) {

  const recipes = props.recipes

  return (
    <div role="tablist" className="tabs tabs-bordered w-350 menu menu-horizontal rounded-box">
    <input type="radio" name="my_tabs_1" role="tab" className="tab grow" aria-label="bakes" />
    <div role="tabpanel" className="tab-content">
      <HomeCard />
    </div>
  
    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      className="tab grow"
      aria-label="saves"
      defaultChecked />
    <div role="tabpanel" className="tab-content">
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
  )
}

function ProfileView() {
  const location = useLocation();

  const userId = location.state.userId;

  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);

  
  useEffect(() => {
    let isMounted = true;
  
    async function fetchUserDetails() {
      try {

        const [userResponse, followingResponse, followerResponse, error] = await Promise.all([
          supabase
            .from('user_profile')
            .select('*')
            .eq('user_auth_id', userId),
          supabase
            .from('user_following_view')
            .select('*')
            .eq('user_id', userId),
          supabase
            .from('user_followers_view')
            .select('*')
            .eq('user_id', userId)
      ]);

          console.log(userId)

        if (error) throw error;

        if (isMounted) {
          setUserDetails(userResponse);
          setFollowerDetails(followerResponse);
          setFollowingDetails(followingResponse);
          setIsLoading(false);
          console.log(userDetails)
        }
      } catch (error) {
        console.error('Error fetching user_profile:', error);
        if (isMounted) setIsLoading(false);
      }
    }

  fetchUserDetails();

    return () => {
      isMounted = false;
    };

  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!userDetails || userDetails.length === 0) return <div>No user details available</div>;

  console.log(userDetails)
  console.log(followerDetails)
  console.log(followingDetails)

  const followerCount = followerDetails.data.length;
  const followingCount = followingDetails.data.length;
  console.log(followingCount)
  const userBio = userDetails?.data[0].bio ;
  const bakesCount = userDetails.data[0].bakes ? userDetails?.data[0].bakes.length : 0;
  const recipesCount = userDetails.data[0].recipes ? userDetails?.data[0].recipes.length : 0;
  const userName = userDetails.data[0].username;
  const bakes = userDetails.data[0].bakes
  const recipes = userDetails.data[0].recipes

  console.log(userDetails)
  const photos = userDetails.images;

  return (
    <div>
      <Header />
      <ProfilePlate userName={userName} followerCount={followerCount} followingCount={followingCount} 
          userBio={userBio} bakes={bakesCount} recipes={recipesCount} userId={userId} />
      <ContentCap recipes={recipes} bakes={bakes} />
      <Footer />
    </div>
  )
}

export default ProfileView
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
  const { recipes, bakes } = props;
  const [activeTab, setActiveTab] = useState('recipes');

  return (
    <ul className="menu menu-horizontal bg-primary rounded-box mt-6 w-350 justify-around">
    <li>
      <a className="tooltip" data-tip="Home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <Cookie />
        </svg>
      </a>
    </li>
    <li>
      <a className="tooltip" data-tip="Details">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <BookOpen />
        </svg>
      </a>
    </li>
  </ul>
  );
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


        if (error) throw error;

        if (isMounted) {
          setUserDetails(userResponse);
          setFollowerDetails(followerResponse);
          setFollowingDetails(followingResponse);
          setIsLoading(false);
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


  const followerCount = followerDetails.data.length;
  const followingCount = followingDetails.data.length;
  const userBio = userDetails?.data[0].bio ;
  const bakesCount = userDetails.data[0].bakes ? userDetails?.data[0].bakes.length : 0;
  const recipesCount = userDetails.data[0].recipes ? userDetails?.data[0].recipes.length : 0;
  const userName = userDetails.data[0].username;
  const bakes = userDetails.data[0].bakes
  const recipes = userDetails.data[0].recipes

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
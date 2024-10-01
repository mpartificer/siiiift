import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import { Cookie } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import PageTitle from './multipurpose/PageTitle.jsx'
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
          <FollowTab number={props.followerCount} measure="followers" path='/profile/followers'/>
          <FollowTab number={props.followingCount} measure="following" path='/profile/following'/>
          <FollowTab number={props.bakes} measure="bakes"/>
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
          <PageTitle pageTitle={props.userName} path={null} />
          <SettingsButton />
        </ProfilePlateTop>
        <ProfilePlateBottom>
          <User size={140} color='#192F01'/>
          <ProfileSummary bakes={props.bakes} followingCount={props.followingCount} followerCount={props.followerCount} userBio={props.userBio}/>
        </ProfilePlateBottom>
      </div>
    )
}

function ContentCap() {

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
      <RecipeCard />
    </div>
  
  </div>
  )
}

function ProfileView() {
  const location = useLocation();

  const userId = location.state.userId;

  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    let isMounted = true;
  
    async function fetchUserDetails() {
      try {
        const { data, error } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_auth_id', userId);

          console.log(userId)

        if (error) throw error;

        if (isMounted) {
          setUserDetails(data);
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

  const followerCount = userDetails[0].followers ? userDetails[0]?.followers.length : 0;
  const followingCount = userDetails[0].following ? userDetails[0]?.following.length : 0;
  const userBio = userDetails[0]?.bio ;
  const privacy = userDetails[0].private;
  const bakes = userDetails[0].bakes ? userDetails[0]?.bakes.length : 0;
  const recipes = userDetails[0].recipes ? userDetails[0]?.recipes : 0;
  const userName = userDetails[0].username;

  console.log(userDetails)
  const photos = userDetails[0].images;

  return (
    <div>
      <Header />
      <ProfilePlate userName={userName} followerCount={followerCount} followingCount={followingCount} 
          userBio={userBio} bakes={bakes} recipes={recipes}/>
      <ContentCap />
      <Footer />
    </div>
  )
}

export default ProfileView
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
  
function ProfileSummary() {
    return (
      <div className='profileSummary'>
        <FollowBar>
          <FollowTab measure="followers" path='/profile/followers'/>
          <FollowTab measure="following" path='/profile/following'/>
          <FollowTab measure="bakes"/>
        </FollowBar>
        <ProfileBlurb profileDescription="jusalittlesomething"/>
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
  
function ProfilePlate() {
    return (
      <div className='profilePlate'>
        <ProfilePlateTop>
          <PageTitle pageTitle="username" path={null} />
          <SettingsButton />
        </ProfilePlateTop>
        <ProfilePlateBottom>
          <User size={140} color='#192F01'/>
          <ProfileSummary />
        </ProfilePlateBottom>
      </div>
    )
}

function ContentCap() {
  return (
    <ul className="menu menu-horizontal bg-primary rounded-box mt-6 w-350 flex flex-row justify-evenly">
      <li>
        <a className="tooltip" data-tip="bakes">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <Cookie color='#EADDFF'/>
          </svg>
        </a>
      </li>
      <div className="divider divider-horizontal divider-accent"></div>
      <li>
        <a className="tooltip" data-tip="recipe box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <BookOpen color='#EADDFF'/>
          </svg>
        </a>
      </li>
    </ul>
  )
}

function ContentCarousel() {
  return (
    <div className="carousel w-350">
      <div className="carousel-item w-full flex flex-column flex-wrap gap-2">
        <HomeCard />
        <HomeCard />
        <HomeCard />
      </div>
      <div className="carousel-item w-full flex flex-column flex-wrap gap-2">
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
    </div>
  )
}

function ProfileView() {
  // const [userDetails, setUserDetails] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   let isMounted = true;

  //   async function fetchUserDetails() {
  //     try {
  //       const { data: { user } } = await supabase.auth.getUser()
  //       const parsedUserId = user.id;

  //       const {data, error} = await supabase
  //         .from('User_Profile')
  //         .select()
  //         .eq('user_auth_id', parsedUserId)

  //       if (error) throw error;

  //       if (isMounted) {
  //         setUserDetails(data);
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching User_Profile:', error);
  //       if (isMounted) setIsLoading(false);
  //     }
  //   }

  // fetchUserDetails();

  //   return () => {
  //     isMounted = false;
  //   };

  // }, []);

  // if (isLoading) return <div>Loading...</div>;

  // console.log(userDetails);
  
  return (
    <div>
      <Header />
      <ProfilePlate />
      <ContentCap />
      <ContentCarousel />
      <Footer />
    </div>
  )
}

export default ProfileView
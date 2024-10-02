import '../App.css'
import Header from './multipurpose/Header.jsx'
import FollowBar from './multipurpose/FollowBar.jsx'
import FollowTab from './multipurpose/FollowTab.jsx'
import SearchBar from './multipurpose/SearchBar.jsx'
import SearchResult from './multipurpose/SearchResult.jsx'
import Footer from './multipurpose/Footer.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

function FollowersView(props) {
  const location = useLocation();

  const userId = location.state.userId;
  console.log(userId, typeof userId)
  const userName = location.state.userName

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
  const bakesCount = userDetails[0].bakes ? recipeDetails[0].bakes.length : 0;

    return (
      <div className='followersView'>
        <Header />
        <FollowBar>
          <FollowTab number={followerCount} measure="followers" username={userName} userId={userId} />
          <FollowTab number={followingCount} measure="following" username={userName} userId={userId} />
          <FollowTab number={bakesCount} measure="bakes" username={userName} userId={userId}/>
        </FollowBar>
        <SearchBar />
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <Footer />
      </div>
    )
  }

  export default FollowersView
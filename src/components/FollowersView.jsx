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

function FollowersView() {
  const location = useLocation();
  const { userId, userName, measure } = location.state || {};

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

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
        setSearchResults(data[measure] || []);
      } catch (error) {
        console.error('Error fetching user_profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId, measure]);

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user details available</div>;

  const followerCount = userDetails.followers?.length || 0;
  const followingCount = userDetails.following?.length || 0;
  const bakesCount = userDetails.bakes?.length || 0;

  console.log(searchResults)
  

  return (
    <div className='followersView'>
      <Header />
      <FollowBar>
        <FollowTab number={followerCount} measure="followers" username={userName} userId={userId} />
        <FollowTab number={followingCount} measure="following" username={userName} userId={userId} />
        <FollowTab number={bakesCount} measure="bakes" username={userName} userId={userId}/>
      </FollowBar>
      <SearchBar />
      {searchResults.length > 0 ? (
        searchResults.map(result => (
          <SearchResult
            key={result.id || result.user_id}
            id={result.id || result.user_id}
            username={result.username}
            searchReturnValue={result.username}
            currentUserId={userId}
          />
        ))
      ) : (
        <div>No {measure} available</div>
      )}
      <Footer />
    </div>
  )
}

export default FollowersView
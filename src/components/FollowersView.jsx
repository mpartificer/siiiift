import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './multipurpose/Header.jsx';
import FollowBar from './multipurpose/FollowBar.jsx';
import FollowTab from './multipurpose/FollowTab.jsx';
import SearchBar from './multipurpose/SearchBar.jsx';
import SearchResult from './multipurpose/SearchResult.jsx';
import Footer from './multipurpose/Footer.jsx';
import { supabase } from '../supabaseClient.js'

function FollowersView(){
  const location = useLocation();
  const { userId, userName, measure } = location?.state || {};

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [followerDetails, setFollowerDetails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      
      if (!supabase || typeof supabase.from !== 'function') {
        setError('Supabase client is not properly initialized');
        setIsLoading(false);
        return;
      }

      if (!userId) {
        setError('No userId provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Attempting to fetch user profile data');
        const { data: profileData, followingData, followerData, error: profileError } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_auth_id', userId)
            .single();
          supabase
            .from('user_following_view')
            .select('*')
            .eq('user_id', userId),
          supabase
            .from('user_followers_view')
            .select('*')
            .eq('user_id', userId)

        if (profileError) throw profileError;

        console.log('User profile data:', profileData);
        setUserDetails(profileData);
        setFollowerDetails(followerData);
        setFollowingDetails(followingData);
        console.log("follower data:", followerDetails)
        console.log("following details: ", followingDetails)

        const viewName = measure === 'followers' ? 'user_followers_view' : 'user_following_view';
        console.log(`Fetching data from ${viewName}`);

        const { data: viewData, error: viewError } = await supabase
          .from(viewName)
          .select('*')
          .eq('user_id', userId);

        if (viewError) throw viewError;

        console.log(`${viewName} data:`, viewData);
        setSearchResults(viewData || []);
      } catch (error) {
        console.error('Detailed error:', error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, measure, supabase]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userDetails) return <div>No user details available</div>;

  const followerCount = userDetails.followers?.length || 0;
  const followingCount = userDetails.following?.length || 0;
  const bakesCount = userDetails.bakes?.length || 0;

  return (
    <div className='followersView'>
      <Header />
      <FollowBar>
        <FollowTab number={followerCount} measure="followers" username={userName} userId={userId} />
        <FollowTab number={followingCount} measure="following" username={userName} userId={userId} />
        <FollowTab number={bakesCount} measure="bakes" username={userName} userId={userId} />
      </FollowBar>
      <SearchBar />
      {searchResults.length > 0 ? (
        searchResults.map(result => (
          <SearchResult
            key={result.follower_id || result.following_id}
            id={result.follower_id || result.following_id}
            username={result.follower_username || result.following_username}
            searchReturnValue={result.follower_username || result.following_username}
            currentUserId={userId}
          />
        ))
      ) : (
        <div>No {measure} available</div>
      )}
      <Footer />
    </div>
  );
};

export default FollowersView;
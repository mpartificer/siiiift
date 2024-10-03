import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { User } from 'lucide-react';

function SearchResult({ id, username, currentUserId, searchReturnValue }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkFollowStatus();
  }, []);

  async function checkFollowStatus() {
    console.log('Checking follow status for currentUserId:', currentUserId, 'and id:', id);
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('following')
        .eq('user_auth_id', currentUserId)
        .single();

      if (error) {
        console.error('Error in checkFollowStatus:', error);
        if (error.code === 'PGRST116') {
          console.log('No user profile found for the current user');
          return;
        }
        throw error;
      }

      console.log('Current user following data:', data.following);
      setIsFollowing(data.following?.some(user => user.id === id) || false);
      console.log('Is following:', isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
      setError('Failed to check follow status');
    }
  }

  async function toggleFollow() {
    console.log('Toggling follow for currentUserId:', currentUserId, 'and id:', id);
    setIsLoading(true);
    setError(null);

    try {
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('user_profile')
        .select('following, username')
        .eq('user_auth_id', currentUserId)
        .single();

      if (currentUserError) {
        console.error('Error fetching current user data:', currentUserError);
        if (currentUserError.code === 'PGRST116') {
          throw new Error('Current user profile not found');
        }
        throw currentUserError;
      }

      console.log('Current user data:', currentUserData);

      const { data: targetUserData, error: targetUserError } = await supabase
        .from('user_profile')
        .select('followers')
        .eq('user_auth_id', id)
        .single();

      if (targetUserError) {
        console.error('Error fetching target user data:', targetUserError);
        if (targetUserError.code === 'PGRST116') {
          throw new Error('Target user profile not found');
        }
        throw targetUserError;
      }

      console.log('Target user data:', targetUserData);

      let newFollowing = [...(currentUserData.following || [])];
      let newFollowers = [...(targetUserData.followers || [])];

      if (isFollowing) {
        newFollowing = newFollowing.filter(user => user.id !== id);
        newFollowers = newFollowers.filter(user => user.id !== currentUserId);
      } else {
        newFollowing.push({ id, username });
        newFollowers.push({ id: currentUserId, username: currentUserData.username });
      }

      console.log('New following:', newFollowing);
      console.log('New followers:', newFollowers);

      const { data: updateCurrentUserData, error: updateCurrentUserError } = await supabase
        .from('user_profile')
        .update({ following: newFollowing })
        .eq('user_auth_id', currentUserId);

      if (updateCurrentUserError) {
        console.error('Error updating current user:', updateCurrentUserError);
        throw updateCurrentUserError;
      }

      console.log('Updated current user data:', updateCurrentUserData);

      const { data: updateTargetUserData, error: updateTargetUserError } = await supabase
        .from('user_profile')
        .update({ followers: newFollowers })
        .eq('user_auth_id', id);

      if (updateTargetUserError) {
        console.error('Error updating target user:', updateTargetUserError);
        throw updateTargetUserError;
      }

      console.log('Updated target user data:', updateTargetUserData);

      setIsFollowing(!isFollowing);
      console.log('Follow status updated successfully');
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setError(error.message || 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='searchResult'>
      <div className='searchDetail'>
        <User size={50} color='#EADDFF' /> 
        {searchReturnValue}
      </div>
      <button className="searchResultButton" onClick={toggleFollow} disabled={isLoading}>
        {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SearchResult;
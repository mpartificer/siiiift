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
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('following')
        .eq('user_auth_id', currentUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No user profile found for the current user');
          return;
        }
        throw error;
      }

      setIsFollowing(data.following?.some(user => user.id === id) || false);
    } catch (error) {
      console.error('Error checking follow status:', error);
      setError('Failed to check follow status');
    }
  }

  async function toggleFollow() {
    setIsLoading(true);
    setError(null);

    try {
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('user_profile')
        .select('following, username')
        .eq('user_auth_id', currentUserId)
        .single();

      if (currentUserError) {
        if (currentUserError.code === 'PGRST116') {
          throw new Error('Current user profile not found');
        }
        throw currentUserError;
      }

      const { data: targetUserData, error: targetUserError } = await supabase
        .from('user_profile')
        .select('followers')
        .eq('user_auth_id', id)
        .single();

      if (targetUserError) {
        if (targetUserError.code === 'PGRST116') {
          throw new Error('Target user profile not found');
        }
        throw targetUserError;
      }

      let newFollowing = [...(currentUserData.following || [])];
      let newFollowers = [...(targetUserData.followers || [])];

      if (isFollowing) {
        newFollowing = newFollowing.filter(user => user.id !== id);
        newFollowers = newFollowers.filter(user => user.id !== currentUserId);
      } else {
        newFollowing.push({ id, username });
        newFollowers.push({ id: currentUserId, username: currentUserData.username });
      }

      const { error: updateCurrentUserError } = await supabase
        .from('user_profile')
        .update({ following: newFollowing })
        .eq('user_auth_id', currentUserId);

      if (updateCurrentUserError) throw updateCurrentUserError;

      const { error: updateTargetUserError } = await supabase
        .from('user_profile')
        .update({ followers: newFollowers })
        .eq('user_auth_id', id);

      if (updateTargetUserError) throw updateTargetUserError;

      setIsFollowing(!isFollowing);
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
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { User } from 'lucide-react';

function SearchResult({ id, username, currentUserId, searchReturnValue }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkFollowStatus();
  }, [id, currentUserId]);

  async function checkFollowStatus() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', currentUserId)
        .eq('following_id', id);

      console.log(data)

      if (error) throw error;

      setIsFollowing(data.length > 0);
    } catch (error) {
      console.error('Error checking follow status:', error);
      setError('Failed to check follow status');
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFollow() {
    setIsLoading(true);
    setError(null);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', id);

        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: currentUserId, following_id: id });

        if (error) throw error;
      }

      await checkFollowStatus(); // Re-check the status after toggling
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setError('Failed to update follow status');
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
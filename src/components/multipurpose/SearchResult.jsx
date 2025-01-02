import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { User, Book } from 'lucide-react';

function SearchResult({ id, currentUserId, searchReturnValue, type }) {
  const [isFollowingOrSaved, setIsFollowingOrSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkStatus();
  }, [id, currentUserId, type]);

  async function checkStatus() {
    setIsLoading(true);
    try {
      if (type === 'user') {
        const { data, error } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', id);

        if (error) throw error;
        setIsFollowingOrSaved(data.length > 0);
      } else if (type === 'recipe') {
        const { data, error } = await supabase
          .from('saves')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('recipe_id', id);

        if (error) throw error;
        setIsFollowingOrSaved(data.length > 0);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setError('Failed to check status');
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleAction() {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'user') {
        if (isFollowingOrSaved) {
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
      } else if (type === 'recipe') {
        if (isFollowingOrSaved) {
          // Unsave
          const { error } = await supabase
            .from('saves')
            .delete()
            .eq('user_id', currentUserId)
            .eq('recipe_id', id);

          if (error) throw error;
        } else {
          // Save
          const { error } = await supabase
            .from('saves')
            .insert({ user_id: currentUserId, recipe_id: id });

          if (error) throw error;
        }
      }

      await checkStatus(); // Re-check the status after toggling
    } catch (error) {
      console.error('Error toggling status:', error);
      setError('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  }

  function getButtonText() {
    if (isLoading) return 'Loading...';
    if (type === 'user') return isFollowingOrSaved ? 'unfollow' : 'follow';
    if (type === 'recipe') return isFollowingOrSaved ? 'unsave' : 'save';
    return 'Action';
  }

  return (
    <div className='searchResult w-350 md:w-96'>
      <div className='searchDetail'>
        {type === 'user' ? <User size={50} color='#EADDFF' /> : <Book size={50} color='#EADDFF' />}
        {searchReturnValue}
      </div>
      <button className="searchResultButton" onClick={toggleAction} disabled={isLoading}>
        {getButtonText()}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SearchResult;
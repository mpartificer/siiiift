import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import { User, Book } from 'lucide-react';

function SearchResult({ currentUserId, searchReturnValue, type, imageUrl, userId, recipeId }) {
  const [isFollowingOrSaved, setIsFollowingOrSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the correct ID based on type
  const relevantId = type === 'user' ? userId : recipeId;

  useEffect(() => {
    checkStatus();
  }, [relevantId, currentUserId, type]);

  async function checkStatus() {
    setIsLoading(true);
    try {
      if (type === 'user') {
        const { data, error } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);

        if (error) throw error;
        setIsFollowingOrSaved(data.length > 0);
      } else if (type === 'recipe') {
        const { data, error } = await supabase
          .from('saves')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('recipe_id', recipeId);

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
          const { error } = await supabase
            .from('followers')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('following_id', userId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('followers')
            .insert({ follower_id: currentUserId, following_id: userId });

          if (error) throw error;
        }
      } else if (type === 'recipe') {
        if (isFollowingOrSaved) {
          const { error } = await supabase
            .from('saves')
            .delete()
            .eq('user_id', currentUserId)
            .eq('recipe_id', recipeId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('saves')
            .insert({ user_id: currentUserId, recipe_id: recipeId });

          if (error) throw error;
        }
      }

      await checkStatus();
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
      <Link 
        to={type === 'user' ? `/profile/${searchReturnValue}` : `/recipe/${recipeId}`}
        state={type === 'user' ? { userId: userId } : { recipeId: recipeId }}
        className='searchDetail hover:bg-primary hover:text-secondary transition-colors'
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={type === 'user' ? 'Profile photo' : 'Recipe image'} 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          type === 'user' ? <User size={50} color='#EBD2AD' /> : <Book size={50} color='#EBD2AD' />
        )}
        <div className='ml-2 mr-2'>
          {searchReturnValue}
        </div>
      </Link>
      <button className="searchResultButton" onClick={toggleAction} disabled={isLoading}>
        {getButtonText()}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SearchResult;
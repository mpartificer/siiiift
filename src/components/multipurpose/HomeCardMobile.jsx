import React, { useState, useEffect } from 'react';
import { Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import PageTitle from './PageTitle.jsx';
import { supabase } from '../../supabaseClient.js';
import '../../App.css';

function PostReactionBox({ currentUserId, username, recipeId, userId, bakeId }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentUserId && bakeId) {  // Only check if we have both values

      checkLikeStatus();
    }
  }, [currentUserId, bakeId]); // Re-run when either of these change

  const checkLikeStatus = async () => {
    if (!currentUserId || !bakeId) return;  // Guard clause
    
    
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('bake_id', bakeId);
  
    if (error) {
      console.error('Error checking like status:', {
        code: error.code,
        msg: error.message,
        details: error.details
      });
    } else {
      setIsLiked(data && data.length > 0);
    }
  };

  const toggleLike = async () => {
    if (!currentUserId || !bakeId) return;  // Guard clause

    if (isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('bake_id', bakeId);

      if (error) {
        console.error('Error removing like:', error);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: currentUserId, bake_id: bakeId, recipe_id: recipeId });

      if (error) {
        console.error('Error adding like:', error);
      } else {
        setIsLiked(true);
      }
    }
  };


  const bakeData = { "userId": userId, "recipeId": recipeId, "username": username }

  const toBakeProfile = () => {
    navigate(`/${username}/${recipeId}`, { state: bakeData })}

  return (
    <div className='postReactionBox mt-1 ml-2.5 md:self-end'>
      <Heart
        size={40}
        color={isLiked ? 'palevioletred' : '#496354'}
        fill={isLiked ? 'palevioletred' : 'none'}
        onClick={toggleLike}
        style={{ cursor: 'pointer' }}
      />
      <Lightbulb 
        size={39} 
        color='#496354' 
        onClick={toBakeProfile}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

function HomeCardMobile(props) {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  return (
    <div className='homeCard standardBorder border-2 m-2 bg-secondary border-primary p-2 w-350'>
      <PageTitle 
        pageTitle={[props.username, props.recipeTitle]} 
        path={[`/profile/${props.username}`, `/recipe/${props.recipeId}`]} 
        userId={props.userId} 
        recipeId={props.recipeId}
      />
      {props.photos && 
        <img 
          src={props.photos}
          alt="recipe" 
          className='recipeImg'
        /> 
      }
      <PostReactionBox 
        username={props.username} 
        recipeId={props.recipeId} 
        currentUserId={currentUserId} 
        bakeId={props.bakeId}
        userId={props.userId}
      />
    </div>
  );
}

export default HomeCardMobile;
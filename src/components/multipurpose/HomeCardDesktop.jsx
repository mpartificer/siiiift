import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, History } from 'lucide-react';
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

  const bakeData = { "userId": userId, "recipeId": recipeId, "username": username };

  const toBakeProfile = () => {
    navigate(`/${username}/${recipeId}`, { state: bakeData });
  };

  return (
    <div className='postReactionBox mt-1 ml-2.5'>
      <Heart
        size={40}
        color={isLiked ? 'palevioletred' : '#496354'}
        fill={isLiked ? 'palevioletred' : 'none'}
        onClick={toggleLike}
        style={{ cursor: 'pointer' }}
      />
      <History 
        size={40} 
        color='#496354' 
        onClick={toBakeProfile}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

function HomeCardDesktop(props) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;  // Flag to prevent setting state after unmount

    const getCurrentUser = async () => {
      try {
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // We have a valid session
          if (isMounted && session.user) {
            setCurrentUserId(session.user.id);
          }
        } else {
          // Optionally redirect to login or handle no-session state
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (isMounted) {
          setAuthError(error.message);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && isMounted) {
        setCurrentUserId(session.user.id);
      }
    });

    getCurrentUser();

    // Cleanup function
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array since we want this to run once on mount

  if (authError) {
    console.error("Authentication error:", authError);
  }

  return (
    <div className="flex flex-col items-center">
      <div className='homeCard standardBorder border-2 m-2 bg-secondary border-primary p-2 flex flex-row w-fit justify-center'>
        {props.photos && 
          <img 
            src={props.photos}
            alt="recipe" 
            className='recipeImg ml-2.5'
          />
        }
        <div className='flex flex-col mr-2.5 w-80'>
          <PageTitle 
            pageTitle={[props.username, props.recipeTitle]} 
            path={[`/profile/${props.username}`, `/recipe/${props.recipeId}`]} 
            userId={props.userId} 
            recipeId={props.recipeId}
          />
          <PostReactionBox 
            username={props.username} 
            recipeId={props.recipeId} 
            currentUserId={currentUserId} 
            bakeId={props.bakeId}
            userId={props.userId}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeCardDesktop;
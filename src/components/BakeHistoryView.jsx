import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from './multipurpose/Header.jsx';
import Footer from './multipurpose/Footer.jsx';
import { Heart } from 'lucide-react';
import PageTitle from './multipurpose/PageTitle.jsx';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure to import your Supabase client

function DateMarker({ date }) {
    return (
        <div className="bg-accent text-secondary-content overflow-hidden standardBorder w-fit pt-1 pb-1 pr-4 pl-4">
            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toLowerCase()}
        </div>
    )
}

function ModInsert({ detail }) {
    return (
        <div>
        <div className="line-through">{detail.original_step_text}</div>
        <div className="text-right font-bold">{detail.updated_step}</div>
        </div>
    )
}

function ModDetailInsert (props) {

    const modDetails = props.modDetails;
    console.log(modDetails)
    return (
        <div>
    <h2 className='font-bold'>{props.title}</h2>
            {modDetails.map((detail) => (
                <ModInsert detail={detail} />
            ))}
    </div>
    )
}

function BakeDetailInsert({ title, description }) {
    return (
        <div>
            <h2 className='font-bold'>{title}</h2>
            <p>{description}</p>
        </div>
    )
}

function BakeHistoryCard({ bakeDetail, likeDetails, modDetails, currentUserDetails }) {

    console.log(modDetails[0].bake_id)
    const likes = []
    const mods = []

    for ( var i = 0; i < likeDetails.length; i++) {
        if (bakeDetail.id === likeDetails[i].bake_id) {
            likes.push(likeDetails[i])
        }
    }

    for (var o = 0; o < modDetails.length; o++) {
        if (bakeDetail.id === modDetails[o].bake_id) {
            mods.push(modDetails[o])
        }
    }

    console.log(currentUserDetails.id)
    console.log(bakeDetail.id)
    const likeCount = likes.length;

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
      checkLikeStatus();
    }, []);
  
    const checkLikeStatus = async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', currentUserDetails.data.user.id)
        .eq('bake_id', bakeDetail.id)
        .single();
  
      if (error) {
        console.error('Error checking like status:', error);
      } else {
        setIsLiked(!!data);
      }
    };
  
    const toggleLike = async () => {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUserDetails.data.user.id)
          .eq('bake_id', bakeDetail.id);
  
        if (error) {
          console.error('Error removing like:', error);
        } else {
          setIsLiked(false);
        }
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: currentUserDetails.data.user.id, 
            bake_id: bakeDetail.id });
  
        if (error) {
          console.error('Error adding like:', error);
        } else {
          setIsLiked(true);
        }
      }
    };
    return (
        <div className='recipeCheckPanel flex flex-col gap-2 bg-secondary p-2'>
            <DateMarker date={bakeDetail.baked_at} />
            <img src={bakeDetail.photos[0] || '/src/assets/TempImage.jpg'} alt='recipe image' className='recipeImg self-center' />
            <div className='flex flex-row gap-1 font-bold items-center text-large'>
            <Heart
        size={30}
        color={isLiked ? 'palevioletred' : '#496354'}
        fill={isLiked ? 'palevioletred' : 'none'}
        onClick={toggleLike}
        style={{ cursor: 'pointer' }}
      />       {likeCount}</div>
            <ModDetailInsert title='modifications' modDetails={modDetails} />
            <BakeDetailInsert title='ai insight' description={bakeDetail.ai_insight} />
        </div>
    )
}

function BakeHistoryView() {
    const location = useLocation();
    const userId = location.state.userId;
    const recipeId = location.state.recipeId;
    const username = location.state.username;

    console.log(recipeId)
    const [bakeDetails, setBakeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeDetails, setLikeDetails] = useState([]);
    const [currentUserDetails, setCurrentUserDetails] = useState([])
    const [modificationDetails, setModificationDetails] = useState([])

    useEffect(() => {
        async function fetchBakeDetails() {
            try {
                const [ recipeResponse, likeResponse, modResponse, userResponse ] = await Promise.all([supabase
                    .from('Bake_Details')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('recipe_id', recipeId)
                    .order('baked_at', { ascending: false }),
                supabase
                    .from('likes')
                    .select('*')
                    .eq('recipe_id', recipeId),
                supabase
                    .from('modifications')
                    .select('*')
                    .eq('recipe_id', recipeId),
                supabase
                    .auth.getUser()
                ])

                if (recipeResponse.error) throw recipeResponse.error;
                if (likeResponse.error) throw likeResponse.error;
                if (modResponse.error) throw modResponse.error;
                if (userResponse.error) throw userResponse.error

                setBakeDetails(recipeResponse.data);
                setLikeDetails(likeResponse.data);
                setModificationDetails(modResponse.data);
                setCurrentUserDetails(userResponse);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBakeDetails();
    }, [userId, recipeId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(currentUserDetails)

    return (
        <div className='followersView'>
            <Header />
            <PageTitle pageTitle={`${username}'s ${bakeDetails[0].recipe_title} history`} />

            {bakeDetails.map((detail) => (
                <BakeHistoryCard key={detail.id} bakeDetail={detail} likeDetails={likeDetails} modDetails={modificationDetails} currentUserDetails={currentUserDetails} />
            ))}
            <Footer />
        </div>
    )
}

export default BakeHistoryView;
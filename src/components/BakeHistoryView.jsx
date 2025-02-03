import React, { useState, useEffect } from 'react';
import '../App.css';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Make sure to import your Supabase client

function DateMarker({ date }) {
    return (
        <div className="bg-primary font-bold text-neutral overflow-hidden standardBorder w-fit pt-1 pb-1 pr-4 pl-4">
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
    if (!modDetails || !Array.isArray(modDetails)) {
        modDetails = [];
    }
    
    if (!likeDetails || !Array.isArray(likeDetails)) {
        likeDetails = [];
    }

    const likes = likeDetails.filter(like => bakeDetail.id === like.bake_id);
    const mods = modDetails.filter(mod => bakeDetail.id === mod.bake_id);
    
    const likeCount = likes.length;
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        checkLikeStatus();
    }, []);
  
    const checkLikeStatus = async () => {
        if (!currentUserDetails?.data?.user?.id) {
            console.error('No user details available');
            return;
        }

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
        if (!currentUserDetails?.data?.user?.id) {
            console.error('No user details available');
            return;
        }

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
                .insert({ 
                    user_id: currentUserDetails.data.user.id, 
                    bake_id: bakeDetail.id 
                });
  
            if (error) {
                console.error('Error adding like:', error);
            } else {
                setIsLiked(true);
            }
        }
    };

    return (
        <div className='recipeCheckPanel w-full md:w-3/5 mx-auto bg-secondary p-4 rounded-lg'>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left side - Image section with fixed height */}
                <div className="md:w-1/2">
                    <DateMarker date={bakeDetail.baked_at} />
                    <div className="h-96 mt-2">
                        <img 
                            src={bakeDetail.photos?.[0] || '/src/assets/TempImage.jpg'} 
                            alt='recipe image' 
                            className='w-full h-full object-cover rounded-lg' 
                        />
                    </div>
                </div>
                
                {/* Right side - Content section with fixed height */}
                <div className="md:w-1/2">
                    <div className='flex items-center gap-2 mb-4'>
                        <Heart
                            size={30}
                            color={isLiked ? 'palevioletred' : '#496354'}
                            fill={isLiked ? 'palevioletred' : 'none'}
                            onClick={toggleLike}
                            style={{ cursor: 'pointer' }}
                        />
                        <span className="font-bold text-lg">{likeCount}</span>
                    </div>
                    
                    {/* Scrollable content area with fixed height */}
                    <div className="h-80 overflow-y-auto pr-2">
                        {mods && mods.length > 0 && (
                            <div className="mb-4">
                                <h2 className='font-bold text-lg mb-2'>modifications</h2>
                                {mods.map((detail, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="line-through text-gray-500">{detail.original_step_text}</div>
                                        <div className="text-right font-bold">{detail.updated_step}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div>
                            <h2 className='font-bold text-lg mb-2'>ai insights</h2>
                            <p>{bakeDetail.ai_insights}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function BakeHistoryView() {
    // Get values from URL parameters instead of location.state
    const { username: userId, recipeid: recipeId } = useParams();
    const [username, setUsername] = useState('');
    const [bakeDetails, setBakeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeDetails, setLikeDetails] = useState([]);
    const [currentUserDetails, setCurrentUserDetails] = useState([]);
    const [modificationDetails, setModificationDetails] = useState([]);

    useEffect(() => {
        async function fetchBakeDetails() {
            try {
                // First fetch the username for the userId
                const userResponse = await supabase
                    .from('profiles')  // assuming you have a profiles table
                    .select('username')
                    .eq('id', userId)
                    .single();

                if (userResponse.error) throw userResponse.error;
                setUsername(userResponse.data.username);

                const [ recipeResponse, likeResponse, modResponse, currentUserResponse ] = await Promise.all([
                    supabase
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
                        .eq('recipe_id', recipeId)
                        .eq('user_id', userId),
                    supabase
                        .auth.getUser()
                ]);

                if (recipeResponse.error) throw recipeResponse.error;
                if (likeResponse.error) throw likeResponse.error;
                if (modResponse.error) throw modResponse.error;
                if (currentUserResponse.error) throw currentUserResponse.error;

                setBakeDetails(recipeResponse.data);
                setLikeDetails(likeResponse.data);
                setModificationDetails(modResponse.data);
                setCurrentUserDetails(currentUserResponse);
            } catch (error) {
                console.error(error.message);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBakeDetails();
    }, [userId, recipeId]);

    if (isLoading) return (
        <HeaderFooter>
            <div className="mt-16">Loading...</div>
        </HeaderFooter>
    );
    
    if (error) return (
        <HeaderFooter>
            <div className="mt-16">Error: {error}</div>
        </HeaderFooter>
    );

    if (!bakeDetails.length) return (
        <HeaderFooter>
            <div className="mt-16">No bakes found</div>
        </HeaderFooter>
    );

    return (
        <div>
            <HeaderFooter>
                <div className='container mx-auto px-4 mt-16 mb-20 flex flex-col items-center'>
                    <div className='text-xl mb-2'>{`${username}'s ${bakeDetails[0].recipe_title} history`}</div>
                    <div className="space-y-6">
                        {bakeDetails.map((detail) => (
                            <BakeHistoryCard 
                                key={detail.id} 
                                bakeDetail={detail} 
                                likeDetails={likeDetails} 
                                modDetails={modificationDetails} 
                                currentUserDetails={currentUserDetails} 
                            />
                        ))}
                    </div>
                </div>
            </HeaderFooter>
        </div>
    );
}

export default BakeHistoryView
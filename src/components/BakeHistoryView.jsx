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

    const mods = modDetails.filter(mod => bakeDetail.id === mod.bake_id);
    
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const likes = likeDetails.filter(like => bakeDetail.id === like.bake_id);
        setLikeCount(likes.length);
        checkLikeStatus();
    }, [bakeDetail.id, likeDetails]);
  
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

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('user_id', currentUserDetails.data.user.id)
                    .eq('bake_id', bakeDetail.id);
    
                if (error) throw error;
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            } else {
                const { error } = await supabase
                    .from('likes')
                    .insert({ 
                        user_id: currentUserDetails.data.user.id, 
                        bake_id: bakeDetail.id 
                    });
    
                if (error) throw error;
                setIsLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className='recipeCheckPanel border-2 border-primary w-full md:w-3/5 mx-auto bg-secondary p-4 rounded-lg'>
            <div className="flex flex-col md:flex-row gap-4">
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
    const { username, recipeid } = useParams();
    console.log("URL params:", { username, recipeid });
    const [profileData, setProfileData] = useState(null);  // Add this state
    const [bakeDetails, setBakeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeDetails, setLikeDetails] = useState([]);
    const [currentUserDetails, setCurrentUserDetails] = useState([]);
    const [modificationDetails, setModificationDetails] = useState([]);

    useEffect(() => {
        async function fetchBakeDetails() {
            if (!username || !recipeid) {
                console.error("Missing required parameters:", { username, recipeid });
                setError("Missing required parameters");
                setIsLoading(false);
                return;
            }
        
            try {
                console.log("Starting fetch with:", { username, recipeid });
                
                // First, let's get our specific user
                const { data: userData, error: userError } = await supabase
                    .from('user_profile')
                    .select('user_auth_id, username')
                    .eq('username', username)
                    .single();
            
                console.log("Found user data:", userData);  // We can see this log is working
            
                if (userError) {
                    console.error("Error fetching user:", userError);
                    throw userError;
                }
                setProfileData(userData);  // Save the profile data

            
                if (!userData || !userData.user_auth_id) {
                    throw new Error(`No user found for username: ${username}`);
                }
            
                // Now use the found user_auth_id for the subsequent queries
                const [ recipeResponse, likeResponse, modResponse, userResponse ] = await Promise.all([
                    supabase
                        .from('Bake_Details')
                        .select('*')
                        .eq('user_id', userData.user_auth_id)  // Use the user_auth_id we found
                        .eq('recipe_id', recipeid)
                        .order('baked_at', { ascending: false }),
                    supabase
                        .from('likes')
                        .select('*')
                        .eq('recipe_id', recipeid),
                    supabase
                        .from('modifications')
                        .select('*')
                        .eq('recipe_id', recipeid)
                        .eq('user_id', userData.user_auth_id),  // Here too
                    supabase
                        .auth.getUser()
                ]);

                console.log("Query responses:", {
                    bakes: recipeResponse.data,
                    likes: likeResponse.data,
                    mods: modResponse.data,
                    user: userResponse
                });

                if (recipeResponse.error) throw recipeResponse.error;
                if (likeResponse.error) throw likeResponse.error;
                if (modResponse.error) throw modResponse.error;
                if (userResponse.error) throw userResponse.error;

                setBakeDetails(recipeResponse.data);
                setLikeDetails(likeResponse.data);
                setModificationDetails(modResponse.data);
                setCurrentUserDetails(userResponse);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBakeDetails();
    }, [username, recipeid]);

    if (isLoading) {
        return (
            <HeaderFooter>
                <div className='container mx-auto px-4 mt-16'>
                    <div>Loading...</div>
                </div>
            </HeaderFooter>
        );
    }

    if (error) {
        return (
            <HeaderFooter>
                <div className='container mx-auto px-4 mt-16'>
                    <div>Error: {error}</div>
                </div>
            </HeaderFooter>
        );
    }

    if (!bakeDetails || bakeDetails.length === 0) {
        return (
            <HeaderFooter>
                <div className='container mx-auto px-4 mt-16'>
                    <div>No bakes found for this recipe</div>
                </div>
            </HeaderFooter>
        );
    }

    return (
        <div>
            <HeaderFooter>
                <div className='container mx-auto px-4 mt-20 mb-20 flex flex-col items-center'>
                    <div className='text-xl mb-2'>
                        {`${profileData.username}'s ${bakeDetails[0].recipe_title} history`}
                    </div>
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
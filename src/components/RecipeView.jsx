import '../App.css';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import { Cookie, Plus, SquareArrowOutUpRight, ChefHat, Bookmark, Heart, Star, Minus } from 'lucide-react';
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient.js'
import HomeCardMobile from './multipurpose/HomeCardMobile';

function RecipeOptions({ originalLink, recipeId, currentUserId, onBakesClick }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkIfSaved();
    }, [currentUserId, recipeId]);

    const checkIfSaved = async () => {
        if (!currentUserId) {
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('saves')
                .select('*')
                .eq('user_id', currentUserId)
                .eq('recipe_id', recipeId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking save status:', error);
            }

            setIsSaved(!!data);
        } catch (error) {
            console.error('Error checking save status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToggle = async () => {
        if (!currentUserId || isLoading) return;

        setIsLoading(true);
        try {
            if (isSaved) {
                // Remove save
                const { error } = await supabase
                    .from('saves')
                    .delete()
                    .eq('user_id', currentUserId)
                    .eq('recipe_id', recipeId);

                if (error) throw error;
            } else {
                // Add save
                const { error } = await supabase
                    .from('saves')
                    .insert([
                        { user_id: currentUserId, recipe_id: recipeId }
                    ]);

                if (error) throw error;
            }

            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error toggling save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ul className="menu menu-horizontal bg-primary rounded-box w-350 items-stretch justify-evenly">
            <li>
                <button 
                    className="tooltip" 
                    data-tip={isSaved ? "remove from saved recipes" : "add to recipe box"}
                    onClick={handleSaveToggle}
                    disabled={isLoading || !currentUserId}
                >
                    {isSaved ? (
                        <Minus color='#EBD2AD'/>
                    ) : (
                        <Plus color='#EBD2AD'/>
                    )}
                </button>
            </li>
            <li>
                <button 
                    className="tooltip" 
                    data-tip="see bakes"
                    onClick={onBakesClick}
                >
                    <Cookie color='#EBD2AD'/>
                </button>
            </li>
            <li>
                <a className="tooltip" data-tip="go to original author" href={originalLink}>
                    <SquareArrowOutUpRight color="#EBD2AD" />
                </a>
            </li>
            <li>
                <a className="tooltip" data-tip="bake">
                    <ChefHat color="#EBD2AD"/>
                </a>
            </li>
        </ul>
    );
}
function RecipeCheckPanel(props) {
    const propInsert = props.propInsert;
    const confirmRecipeItem = props.confirmRecipeItem;

    if (!Array.isArray(propInsert)) {
        console.error(`PropInsert is not an array for ${confirmRecipeItem}`);
        return <div>Error: Invalid data format</div>;
    }

    let myComponentList;

    if (confirmRecipeItem === 'ingredients') {
        myComponentList = propInsert.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
                return <li key={index}>{item.amount} {item.substance}</li>;
            } else {
                return <li key={index}>{JSON.stringify(item.amount)} {JSON.stringify(item.substance)}</li>;
            }
        });
    } else if (confirmRecipeItem === 'instructions') {
        myComponentList = propInsert.map((item, index) => {
            const instruction = typeof item === 'string' ? item : item.instruction;
            return <li key={index} className="mb-2">{index + 1}. {instruction}</li>;
        });
    } else {
        console.error(`Unknown confirmRecipeItem: ${confirmRecipeItem}`);
        return <div>Error: Unknown recipe item type</div>;
    }

    return (
        <div className='recipeCheckPanel w-350'>
            <RecipeCheckTitle recipeCheckTitle={confirmRecipeItem} />
            <ul className='recipeCheckPanelList'>
                {myComponentList}
            </ul>
        </div>
    );
}

function TimeCheck(props) {
    return (
        <div className='items-center text-lg'>
         <b>prep</b><br /> {props.prepTime} minutes <br />
         <b>cook</b><br /> {props.cookTime} minutes <br />
         <b>total</b><br /> {props.totalTime} minutes <br />
        </div>
    )
}

function PopularityCheck(props) {
    return (
        <div className='grid grid-cols-2 '>
            <PopularityCounter Label='Heart' Count={props.likes} />
            <PopularityCounter Label='Star' Count={props.rating} />
            <PopularityCounter Label='ChefHat' Count={props.bakes} />
            <PopularityCounter Label='Bookmark' Count={props.saves} />
        </div>
    )
}

function PopularityCounter(props) {
    var descriptor = ''
    if (props.Label === 'Heart') {
        descriptor = 'likes'
        return(
            <div className='followTab'>
                <Heart 
                    color={props.Count > 0 ? 'palevioletred' : '#496354'} 
                    size={40}
                    fill={props.Count > 0 ? 'palevioletred' : 'none'}
                />
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'Star') {
        descriptor = 'stars'
        return(
            <div className='followTab'>
                <Star color='#496354' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'ChefHat') {
        descriptor = 'bakes'
        return(
            <div className='followTab'>
                <ChefHat color='#496354' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'Bookmark' ) {
        descriptor = 'saves'
        return(
            <div className='followTab'>
                <Bookmark color='#496354' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }

}

function RecipeSummaryPanel(props) {
    return (
        <div className='recipeCheckPanel w-350 flex flex-row p-5 justify-between'>
            <TimeCheck totalTime={props.totalTime} cookTime={props.cookTime} prepTime={props.prepTime} />
            <div className="divider divider-primary divider-horizontal"></div>
            <PopularityCheck likes={props.likes} saves={props.saves} bakes={props.bakes} rating={props.rating} />
        </div>
    )
}


function RecipeCheckTitle(props) {
    return (
      <div className='recipeCheckTitle'>
        {props.recipeCheckTitle}
      </div>
    )
}

// ... (keep all previous imports and component definitions until BakesList)

function BakesList({ recipeId, currentUserId, isMobile }) {
    const [bakes, setBakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBakes() {
            try {
                const { data, error } = await supabase
                    .from('bake_details_view')
                    .select('*')
                    .eq('recipe_id', recipeId);

                if (error) throw error;
                setBakes(data || []);
            } catch (error) {
                console.error('Error fetching bakes:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBakes();
    }, [recipeId]);

    if (isLoading) return <div>Loading bakes...</div>;
    if (bakes.length === 0) return <div>No bakes yet</div>;

    return (
        <div className={isMobile ? 'flex flex-col gap-4' : 'flex flex-row flex-wrap justify-center gap-4'}>
            {bakes.map((bake) => (
                <HomeCardMobile
                    key={bake.bake_id}
                    username={bake.username}
                    recipeTitle={bake.recipe_title}
                    photos={bake.photos}
                    recipeId={bake.recipe_id}
                    currentUserId={currentUserId}
                    bakeId={bake.bake_id}
                    userId={bake.user_id}
                />
            ))}
        </div>
    );
}


function RecipeView() {
    const location = useLocation();
    const recipeId = location.state.recipeId;
    const [currentUserId, setCurrentUserId] = useState(null);
    const bakesRef = useRef(null); // Add ref for scrolling

    const [recipeDetails, setRecipeDetails] = useState(null);
    const [ratingDetails, setRatingDetails] = useState(null);
    const [likesCount, setLikesCount] = useState(0);
    const [savesCount, setSavesCount] = useState(0);
    const [bakesCount, setBakesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Get current user's ID
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        };

        async function fetchData() {
            try {
                const [recipeResponse, ratingResponse, likesResponse, savesResponse, bakesResponse] = await Promise.all([
                    supabase
                        .from('recipe_profile')
                        .select('*')
                        .eq('id', recipeId)
                        .single(),
                    supabase
                        .from('bake_recipe_ratings')
                        .select('*')
                        .eq('recipe_id', recipeId),
                    supabase
                        .from('likes')
                        .select('*', { count: 'exact' })
                        .eq('recipe_id', recipeId),
                    supabase
                        .from('saves')
                        .select('*', { count: 'exact' })
                        .eq('recipe_id', recipeId),
                    supabase
                        .from('Bake_Details')
                        .select('*', { count: 'exact' })
                        .eq('recipe_id', recipeId)
                ]);

                if (recipeResponse.error) throw recipeResponse.error;
                if (ratingResponse.error) throw ratingResponse.error;
                if (likesResponse.error) throw likesResponse.error;
                if (savesResponse.error) throw savesResponse.error;
                if (bakesResponse.error) throw bakesResponse.error;

                setRecipeDetails(recipeResponse.data);
                setRatingDetails(ratingResponse.data);
                setLikesCount(likesResponse.count || 0);
                setSavesCount(savesResponse.count || 0);
                setBakesCount(bakesResponse.count || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getCurrentUser();
        fetchData();
    }, [recipeId]);

    if (isLoading) return <div>Loading...</div>;
    if (!recipeDetails) return <div>No recipe details available</div>;

    // Define all variables from recipeDetails
    const recipeTitle = recipeDetails.title.toString();
    const totalTime = recipeDetails.total_time.toString();
    const cookTime = recipeDetails.cook_time.toString();
    const prepTime = recipeDetails.prep_time.toString();
    const ingredients = recipeDetails?.ingredients || [];
    const instructions = recipeDetails?.instructions || [];
    const originalLink = recipeDetails.original_link;
    const photos = recipeDetails.images;

    let ratingSum = 0;
    
    for (let i = 0; i < ratingDetails[0].all_ratings.length; i++) {
        ratingSum += ratingDetails[0].all_ratings[i];
    }

    let rating = ratingSum / ratingDetails[0].all_ratings.length;
    rating = rating.toFixed(2);

    const handleBakesScroll = () => {
        const element = bakesRef.current;
        if (!element) return;
    
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const headerOffset = 100; // Adjust this value based on your header height
        const offsetPosition = elementPosition - headerOffset;
    
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    };

    return (
        <div>
            <HeaderFooter>
                {windowWidth > 768 ? (
                    <div className='flex flex-col mt-20 mb-16 gap-8 w-full items-center'>
                        <div className='flex flex-row gap-8 w-full justify-center'>
                            <div className='flex flex-col gap-4 items-end'>
                                <div className='pageTitle text-xl'>{recipeTitle}</div>
                                <img src={photos} alt="recipe image" className='recipeImg' />
                                <RecipeSummaryPanel totalTime={totalTime} 
                                    cookTime={cookTime} 
                                    prepTime={prepTime} 
                                    likes={likesCount} 
                                    bakes={bakesCount} 
                                    saves={savesCount} 
                                    rating={rating} 
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <RecipeOptions 
                                    originalLink={originalLink}
                                    recipeId={recipeId}
                                    currentUserId={currentUserId}
                                    onBakesClick={handleBakesScroll}
                                />
                                <RecipeCheckPanel propInsert={ingredients} confirmRecipeItem='ingredients' />
                                <RecipeCheckPanel propInsert={instructions} confirmRecipeItem='instructions' />
                            </div>
                        </div>
                        <div className="divider divider-accent w-1/2 self-center" ref={bakesRef}>bakes</div>
                        <div className='w-full max-w-7xl px-4'>
                            <BakesList recipeId={recipeId} currentUserId={currentUserId} isMobile={false} />
                        </div>
                    </div>
                ) : (
                    <div className='followersView mt-16 mb-16 text-xl wrap'>
                        <div className='pageTitle'>{recipeTitle}</div>
                        <img src={photos} alt="recipe image" className='recipeImg' />
                        <RecipeOptions 
                            originalLink={originalLink}
                            recipeId={recipeId}
                            currentUserId={currentUserId}
                            onBakesClick={handleBakesScroll}
                        />
                        <RecipeSummaryPanel totalTime={totalTime} 
                            cookTime={cookTime} 
                            prepTime={prepTime} 
                            likes={likesCount} 
                            bakes={bakesCount} 
                            saves={savesCount} 
                            rating={rating} 
                        />
                        <RecipeCheckPanel propInsert={ingredients} confirmRecipeItem='ingredients' />
                        <RecipeCheckPanel propInsert={instructions} confirmRecipeItem='instructions' />
                        <div className="divider divider-accent w-1/2 self-center" ref={bakesRef}>bakes</div>
                        <div className='mt-8'>
                            <BakesList recipeId={recipeId} currentUserId={currentUserId} isMobile={true} />
                        </div>
                    </div>
                )}
            </HeaderFooter>
        </div>
    );
}

export default RecipeView;
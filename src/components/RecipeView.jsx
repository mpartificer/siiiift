import '../App.css';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import { Cookie } from 'lucide-react';
import { Plus } from 'lucide-react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { ChefHat } from 'lucide-react';
import { Bookmark } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Star } from 'lucide-react';
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

function RecipeOptions(props) {
    return (
        <ul className="menu menu-horizontal bg-primary rounded-box w-350 items-stretch justify-evenly">
            <li>
                <a className="tooltip" data-tip="add to recipe box">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <Plus color='#EADDFF'/>
                </svg>
                </a>
            </li>
            <li>
                <a className="tooltip" data-tip="see bakes">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <Cookie color='#EADDFF'/>
                </svg>
                </a>
            </li>
            <li>
                <a className="tooltip" data-tip="go to original author" href={props.originalLink}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <SquareArrowOutUpRight color='#EADDFF'/>
                </svg>
                </a>
            </li>
            <li>
                <a className="tooltip" data-tip="bake">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <ChefHat color='#EADDFF'/>
                </svg>
                </a>
            </li>
        </ul>
    )
}

function RecipeCheckPanel(props) {
    const propInsert = props.propInsert;
    const confirmRecipeItem = props.confirmRecipeItem;

    console.log('PropInsert:', propInsert);
    console.log('ConfirmRecipeItem:', confirmRecipeItem);

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
            if (typeof item === 'string') {
                return <li key={index}>{item.instruction}</li>;
            } else {
                return <li key={index}>{JSON.stringify(item.instruction)}</li>;
            }
        });
    } else {
        console.error(`Unknown confirmRecipeItem: ${confirmRecipeItem}`);
        return <div>Error: Unknown recipe item type</div>;
    }

    return (
        <div className='recipeCheckPanel sm:w-350'>
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
                <Heart color='#192F01' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'Star') {
        descriptor = 'stars'
        return(
            <div className='followTab'>
                <Star color='#192F01' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'ChefHat') {
        descriptor = 'bakes'
        return(
            <div className='followTab'>
                <ChefHat color='#192F01' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }
    else if (props.Label === 'Bookmark' ) {
        descriptor = 'saves'
        return(
            <div className='followTab'>
                <Bookmark color='#192F01' size={40}/>
                {props.Count} {descriptor}
            </div>
        )
    }

}

function RecipeSummaryPanel(props) {
    return (
        <div className='recipeCheckPanel sm:w-350 flex flex-row p-5 justify-between'>
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

function RecipeView() {
        const location = useLocation();
        const recipeId = location.state.recipeId;
    
        const [recipeDetails, setRecipeDetails] = useState(null);
        const [ratingDetails, setRatingDetails] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
    
        useEffect(() => {
            async function fetchData() {
                try {
                    const [recipeResponse, ratingResponse] = await Promise.all([
                        supabase
                            .from('recipe_profile')
                            .select('*')
                            .eq('id', recipeId)
                            .single(),
                        supabase
                            .from('bake_recipe_ratings')
                            .select('*')
                            .eq('recipe_id', recipeId)
                    ]);
    
                    if (recipeResponse.error) throw recipeResponse.error;
                    if (ratingResponse.error) throw ratingResponse.error;
    
                    setRecipeDetails(recipeResponse.data);
                    setRatingDetails(ratingResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setIsLoading(false);
                }
            }
    
            fetchData();
        }, [recipeId]);
    
        if (isLoading) return <div>Loading...</div>;
        if (!recipeDetails) return <div>No recipe details available</div>;

        console.log(ratingDetails)

    const recipeTitle = recipeDetails.title.toString();
    const totalTime = recipeDetails.total_time.toString();
    const cookTime = recipeDetails.cook_time.toString();
    const prepTime = recipeDetails.prep_time.toString();
    const likes = recipeDetails.likes ? recipeDetails.likes.length : 0;
    const bakes = recipeDetails.bakes ? recipeDetails.bakes.length : 0;
    const saves = recipeDetails.saves ? recipeDetails.saves.length : 0;
    const ingredients = recipeDetails?.ingredients || [];
    const instructions = recipeDetails?.instructions || [];
    const originalLink = recipeDetails.original_link;
    const photos = recipeDetails.images;

    let ratingSum = 0;
    
    for (let i=0; i<ratingDetails[0].all_ratings.length; i++) {
        ratingSum += ratingDetails[0].all_ratings[i];
    }

    let rating = ratingSum / ratingDetails[0].all_ratings.length;

    rating = rating.toFixed(2)

    return (
        <div>
            <HeaderFooter>
            <div className='followersView mt-16 mb-16'>
                <div className='pageTitle'>{recipeTitle}</div>
                <img src={photos} alt="recipe image" className='recipeImg' />
                <RecipeOptions originalLink={originalLink} />
                <RecipeSummaryPanel totalTime={totalTime} cookTime={cookTime} prepTime={prepTime} 
                                    likes={likes} bakes={bakes} saves={saves} rating={rating} />
                <RecipeCheckPanel propInsert={ingredients} confirmRecipeItem='ingredients' />
                <RecipeCheckPanel propInsert={instructions} confirmRecipeItem='instructions' />
            </div>
            </HeaderFooter>
        </div>
    )
}   

export default RecipeView
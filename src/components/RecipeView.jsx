import '../App.css';
import Header from './multipurpose/Header.jsx';
import Footer from './multipurpose/Footer.jsx';
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
        <div className='recipeCheckPanel'>
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
            <PopularityCounter Label='Star' Count='4.5' />
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
        <div className='recipeCheckPanel flex flex-row p-5 justify-between'>
            <TimeCheck totalTime={props.totalTime} cookTime={props.cookTime} prepTime={props.prepTime} />
            <div className="divider divider-primary divider-horizontal"></div>
            <PopularityCheck likes={props.likes} saves={props.saves} bakes={props.bakes} />
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

    console.log(recipeId)

    const navigate = useNavigate()

    const [recipeDetails, setRecipeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  
    useEffect(() => {
      let isMounted = true;
  
      async function fetchRecipeDetails() {
        try {
          const { data, error } = await supabase
            .from('recipe_profile')
            .select('*')
            .eq('id', recipeId);

            console.log(recipeId)
  
          if (error) throw error;
  
          if (isMounted) {
            setRecipeDetails(data);
            setIsLoading(false);
            console.log(recipeDetails)
          }
        } catch (error) {
          console.error('Error fetching recipe_profile:', error);
          if (isMounted) setIsLoading(false);
        }
      }
  
    fetchRecipeDetails();
  
      return () => {
        isMounted = false;
      };

    }, []);
  
    if (isLoading) return <div>Loading...</div>;

    if (!recipeDetails || recipeDetails.length === 0) return <div>No recipe details available</div>;

    const recipeTitle = recipeDetails[0].title.toString();
    const totalTime = recipeDetails[0].total_time.toString();
    const cookTime = recipeDetails[0].cook_time.toString();
    const prepTime = recipeDetails[0].prep_time.toString();
    const likes = recipeDetails[0].likes ? recipeDetails[0].likes.length : 0;
    const bakes = recipeDetails[0].bakes ? recipeDetails[0].bakes.length : 0;
    const saves = recipeDetails[0].saves ? recipeDetails[0].saves.length : 0;
    const ingredients = recipeDetails[0]?.ingredients || [];
    const instructions = recipeDetails[0]?.instructions || [];
    const originalLink = recipeDetails[0].original_link;

    console.log(recipeDetails)
    const photos = recipeDetails[0].images;

    return (
        <div className='followersView'>
            <Header />
            <div className='pageTitle'>{recipeTitle}</div>
            <img src={photos} alt="recipe image" className='recipeImg' />
            <RecipeOptions originalLink={originalLink} />
            <RecipeSummaryPanel totalTime={totalTime} cookTime={cookTime} prepTime={prepTime} 
                                likes={likes} bakes={bakes} saves={saves}/>
            <RecipeCheckPanel propInsert={ingredients} confirmRecipeItem='ingredients' />
            <RecipeCheckPanel propInsert={instructions} confirmRecipeItem='instructions' />
            <Footer />
        </div>
    )
}   

export default RecipeView
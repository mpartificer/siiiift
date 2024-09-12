import '../App.css';
import Header from './multipurpose/Header.jsx';
import Footer from './multipurpose/Footer.jsx';
import PageTitle from './multipurpose/PageTitle.jsx';
import { Cookie } from 'lucide-react';
import { Plus } from 'lucide-react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { ChefHat } from 'lucide-react';
import { Bookmark } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Star } from 'lucide-react';

function RecipeOptions() {
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
                <a className="tooltip" data-tip="go to original author">
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
    const myComponentList = propInsert.map((item, index) => (
      <li key={index}>{item}</li>));
  
    return (
      <div className='recipeCheckPanel'>
        <RecipeCheckTitle recipeCheckTitle={props.confirmRecipeItem} />
        <ul className='recipeCheckPanelList'>
        {myComponentList}
        </ul>
      </div>
    )
}

function TimeCheck() {
    return (
        <div className='items-center text-lg'>
         <b>prep</b><br /> 15 minutes <br />
         <b>cook</b><br /> 15 minutes <br />
         <b>total</b><br /> 30 minutes <br />
        </div>
    )
}

function PopularityCheck() {
    return (
        <div className='grid grid-cols-2 '>
            <PopularityCounter Label='Heart' Count='100' />
            <PopularityCounter Label='Star' Count='4.5' />
            <PopularityCounter Label='ChefHat' Count='100' />
            <PopularityCounter Label='Bookmark' Count='100' />
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

function RecipeSummaryPanel() {
    return (
        <div className='recipeCheckPanel flex flex-row p-5 justify-between'>
            <TimeCheck />
            <div className="divider divider-primary divider-horizontal"></div>
            <PopularityCheck />
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
    return (
        <div className='followersView'>
            <Header />
            <PageTitle pageTitle='recipe title' />
            <img src="src/assets/TempImage.jpg" alt="recipe image" className='recipeImg' />
            <RecipeOptions />
            <RecipeSummaryPanel />
            <RecipeCheckPanel propInsert={['sugar', 'butter', 'bread']} confirmRecipeItem='ingredients' />
            <RecipeCheckPanel propInsert={['preheat oven', 'roll out dough', 'eat and enjoy']} confirmRecipeItem='instructions' />
            <Footer />
        </div>
    )
}   

export default RecipeView
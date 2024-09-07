import '../App.css'
import CheckBox from './multipurpose/CheckBox.jsx'
import Header from './multipurpose/Header.jsx'
import SearchBar from './multipurpose/SearchBar.jsx'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import Footer from './multipurpose/Footer.jsx'



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
        <CheckBox confirmRecipeItem={props.confirmRecipeItem} />
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

function WebsiteRetrievalView() {
    return (
      <div className='websiteRetrievalView'>
        <Header />
        <SearchBar />
        <RecipeCheckPanel propInsert={['brownies']} confirmRecipeItem='recipe title' />
        <RecipeCheckPanel propInsert={['sugar', 'butter', 'bread']} confirmRecipeItem='ingredients' />
        <RecipeCheckPanel propInsert={['preheat oven', 'roll out dough', 'eat and enjoy']} confirmRecipeItem='instructions' />
        <RecipeCheckPanel propInsert={['45 minutes']} confirmRecipeItem='prep time' />
        <RecipeCheckPanel propInsert={['15 minutes']} confirmRecipeItem='cook time' />
        <RecipeCheckPanel propInsert={['1 hour']} confirmRecipeItem='total time' />
        <RecipeCheckPanel propInsert={['Sallys Baking Addiction']} confirmRecipeItem='original author' />
        <RecipeCheckPanel propInsert={['']} confirmRecipeItem='default image' />
        <BigSubmitButton submitValue='submit' />
        <Footer />
      </div>
    )
}

export default WebsiteRetrievalView
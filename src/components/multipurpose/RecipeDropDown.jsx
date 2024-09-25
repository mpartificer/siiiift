import { supabase } from '../../supabaseClient.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import { useEffect } from 'react'

const RecipeDropDown = (props) => {
    const [recipeData, setRecipeData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                const { data: recipeData, error: recipeError } = await supabase
                .from('user_profile')
                .select('recipes')
                .eq('user_auth_id', user.id)
                .single()

                console.log(recipeData)

                if (recipeError) throw recipeError
                // const parsedRecipes = recipeData.recipes ? JSON.parse(recipeData.recipes) : []
                setRecipeData(recipeData.recipes)

                console.log(recipeData)
            }
        catch (err) {
            console.error('Error:', err)
setError(err.message)        } finally {setLoading(false)}
        }

        
        fetchRecipes()
    }, [])

    if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const myComponentList = recipeData.map((item) => (
    <li key={item.id}><a>{item.recipetitle}</a></li>));


    const modificationType = 'choose your recipe:';
    return (
      <div className="dropdown profilePlate">
        {/* <PostSettingTitle settingTitle={modificationType} /> */}
        <div tabIndex={0} role="button" className="btn m-1 w-80 bg-secondary modificationDropDown">assign to recipe:</div>
        <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow ">
        {myComponentList} 
        </ul> 
      </div>
    )
  }

  export default RecipeDropDown
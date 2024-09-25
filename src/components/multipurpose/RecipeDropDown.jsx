import { supabase } from '../../supabaseClient.js'
import { useState, useEffect } from 'react'
import '../../App.css'

const RecipeDropDown = (props) => {
    const [recipeData, setRecipeData] = useState(null)
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [ingredientData, setIngredientData] = useState(null)
    const [instructionData, setInstructionData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchModItems = async (recipeId) => {
        try {
            const { data: ingredientData, error: ingError } = await supabase
                .from('recipe_profile')
                .select('ingredients')
                .eq('id', recipeId)
                .single()

            if (ingError) throw ingError
            setIngredientData(ingredientData.ingredients)
            console.log(ingredientData)

            const { data: instructionData, error: instError } = await supabase
                .from('recipe_profile')
                .select('instructions')
                .eq('id', recipeId)
                .single()

            if (instError) throw instError
            setInstructionData(instructionData.instructions)
            console.log(instructionData)

            setSelectedRecipe(recipeId)
        } catch (err) {
            console.error('Error:', err)
            setError(err.message)
        }
    }

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                const { data: recipeData, error: recipeError } = await supabase
                    .from('user_profile')
                    .select('recipes')
                    .eq('user_auth_id', user.id)
                    .single()

                if (recipeError) throw recipeError
                setRecipeData(recipeData.recipes)
            } catch (err) {
                console.error('Error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        
        fetchRecipes()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="profilePlate">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1 w-80 bg-secondary modificationDropDown">select a recipe:</div>
                <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow">
                    {recipeData && recipeData.map((item) => (
                        <li key={item.id} onClick={() => fetchModItems(item.id)}><a>{item.recipetitle}</a></li>
                    ))}
                </ul>
            </div>
            
            {selectedRecipe && (
                <>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1 w-80 bg-secondary modificationDropDown">select an ingredient:</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow">
                            {ingredientData && ingredientData.map((item, index) => (
                                <li key={index}><a>{typeof item === 'object' ? `${item.amount} ${item.substance}` : item}</a></li>
                            ))}
                        </ul>
                    </div>
                    <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />


                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1 w-80 bg-secondary modificationDropDown">select an instruction:</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow">
                            {instructionData && instructionData.map((item) => (
                                <li key={item.id}><a>{item.instruction}</a></li>
                            ))}
                        </ul>
                    </div>
                    <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />

                </>
            )}
                    </div>
    )
}

export default RecipeDropDown
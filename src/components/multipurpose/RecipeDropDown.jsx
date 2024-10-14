import { supabase } from '../../supabaseClient.js'
import { useState, useEffect } from 'react'
import '../../App.css'

const ModificationItem = ({ items, placeholder, onChange, value }) => {
    const [selectedItem, setSelectedItem] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (item) => {
        setSelectedItem(item)
        setIsOpen(false)
    }

    return (
        <div className="flex flex-col mb-2">
            <div className="dropdown mb-1">
                <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn w-80 bg-secondary modificationDropDown"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedItem ? 
                        (typeof selectedItem === 'object' ? 
                            (selectedItem.instruction || `${selectedItem.amount} ${selectedItem.substance}`) 
                            : selectedItem
                        ) 
                        : 'select item'}
                </div>
                {isOpen && (
                    <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow">
                        {items.map((item, index) => (
                            <li key={index} onClick={() => handleSelect(item)}>
                                <a>{typeof item === 'object' ? (item.instruction || `${item.amount} ${item.substance}`) : item}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <input 
                type="text" 
                value={value}
                onChange={onChange}
                placeholder={placeholder} 
                className="input w-80 max-w-xs customModification" 
            />
        </div>
    )
}

const RecipeDropDown = (props) => {
    const [recipeData, setRecipeData] = useState(null)
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [ingredientData, setIngredientData] = useState(null)
    const [instructionData, setInstructionData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [ingredientModifications, setIngredientModifications] = useState([''])
    const [instructionModifications, setInstructionModifications] = useState([''])
    const [isRecipeDropdownOpen, setIsRecipeDropdownOpen] = useState(false)

    const fetchModItems = async (recipeId, recipeTitle) => {
        props.setRecipeId(recipeId);
        props.setRecipeTitle(recipeTitle);

        try {
            const { data: ingredientData, error: ingError } = await supabase
                .from('recipe_profile')
                .select('ingredients')
                .eq('id', recipeId)
                .single()

            if (ingError) throw ingError
            setIngredientData(ingredientData.ingredients)

            const { data: instructionData, error: instError } = await supabase
                .from('recipe_profile')
                .select('instructions')
                .eq('id', recipeId)
                .single()

            if (instError) throw instError
            setInstructionData(instructionData.instructions)

            setSelectedRecipe(recipeId)
            setIsRecipeDropdownOpen(false) 
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

    const addIngredientModification = () => {
        setIngredientModifications([...ingredientModifications, ''])
    }

    const addInstructionModification = () => {
        setInstructionModifications([...instructionModifications, ''])
    }

    const handleIngredientModificationChange = (index, value) => {
        const newModifications = [...ingredientModifications]
        newModifications[index] = value
        setIngredientModifications(newModifications)
    }

    const handleInstructionModificationChange = (index, value) => {
        const newModifications = [...instructionModifications]
        newModifications[index] = value
        setInstructionModifications(newModifications)
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="profilePlate">
            <div className="dropdown">
                <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn m-1 w-80 bg-secondary modificationDropDown"
                    onClick={() => setIsRecipeDropdownOpen(!isRecipeDropdownOpen)}
                >
                    {selectedRecipe ? recipeData.find(item => item.id === selectedRecipe)?.recipetitle : 'select a recipe:'}
                </div>
                {isRecipeDropdownOpen && (
                    <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow">
                        {recipeData && recipeData.map((item) => (
                            <li key={item.id} onClick={() => fetchModItems(item.id, item.title)}>
                                <a>{item.recipetitle}</a>
                            </li>
                        ))}
                    </ul>
                )}
                </div>
                                    
            
            {selectedRecipe && (
                <>
                    <h3 className="mt-4 mb-2">ingredient modifications:</h3>
                    {ingredientModifications.map((mod, index) => (
                        <ModificationItem
                            key={index}
                            items={ingredientData || []}
                            placeholder="enter your ingredient modification"
                            value={mod}
                            onChange={(e) => handleIngredientModificationChange(index, e.target.value)}
                        />
                    ))}
                    <a href="#" onClick={addIngredientModification} className="mb-4">add another ingredient modification</a>

                    <h3 className="mt-4 mb-2">instruction modifications:</h3>
                    {instructionModifications.map((mod, index) => (
                        <ModificationItem
                            key={index}
                            items={instructionData || []}
                            placeholder="enter your instruction modification"
                            value={mod}
                            onChange={(e) => handleInstructionModificationChange(index, e.target.value)}
                        />
                    ))}
                    <a href="#" onClick={addInstructionModification} >add another instruction modification</a>
                </>
            )}
        </div>
    )
}

export default RecipeDropDown
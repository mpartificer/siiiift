import { supabase } from '../../supabaseClient.js'
import { useState, useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import '../../App.css'

const ModificationItem = ({ items, placeholder, index, type }) => {
    const [selectedItem, setSelectedItem] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const { register, setValue, watch } = useFormContext()
    
    const fieldName = type === 'ingredient' 
        ? `ingredientModifications.${index}` 
        : `instructionModifications.${index}`

    const handleSelect = (item) => {
        setSelectedItem(item)
        setIsOpen(false)
        setValue(
            `${fieldName}.original${type === 'ingredient' ? 'Ingredient' : 'Instruction'}`,
            type === 'ingredient' ? `${item.amount} ${item.substance}` : item.instruction
        )
    }

    return (
        <div className="flex flex-col mb-2">
            <div className="dropdown mb-1 md:m-0">
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
                        {items.map((item, idx) => (
                            <li key={idx} onClick={() => handleSelect(item)}>
                                <a>{typeof item === 'object' ? (item.instruction || `${item.amount} ${item.substance}`) : item}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <input 
                type="text"
                placeholder={placeholder}
                className="input w-80 max-w-xs customModification"
                {...register(`${fieldName}.modified${type === 'ingredient' ? 'Ingredient' : 'Instruction'}`)}
            />
        </div>
    )
}

const RecipeDropDown = () => {
    const [recipeData, setRecipeData] = useState(null)
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [ingredientData, setIngredientData] = useState(null)
    const [instructionData, setInstructionData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isRecipeDropdownOpen, setIsRecipeDropdownOpen] = useState(false)

    const { control, setValue } = useFormContext()
    const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
        control,
        name: 'ingredientModifications'
    })
    const { fields: instructionFields, append: appendInstruction } = useFieldArray({
        control,
        name: 'instructionModifications'
    })

    const fetchModItems = async (recipeId, recipeTitle) => {
        setValue('recipeId', recipeId)
        setValue('recipeTitle', recipeTitle)

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
                    .from('saves_view')
                    .select('')
                    .eq('user_id', user.id)

                if (recipeError) throw recipeError
                setRecipeData(recipeData)
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
        <div className="profilePlate items-center">
            <div className="dropdown">
                <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn m-1 md:m-0 w-80 bg-secondary overflow-y-auto modificationDropDown"
                    onClick={() => setIsRecipeDropdownOpen(!isRecipeDropdownOpen)}
                >
                    {selectedRecipe ? recipeData.find(item => item.recipe_id === selectedRecipe)?.recipe_title : 'select a recipe:'}
                </div>
                {isRecipeDropdownOpen && (
                    <ul tabIndex={0} className="dropdown-content menu bg-secondary overflow-hidden rounded-box z-[1] w-52 p-2 shadow">
                        {recipeData && recipeData.map((item) => (
                            <li key={item.recipe_id} onClick={() => fetchModItems(item.recipe_id, item.recipe_title)}>
                                <a>{item.recipe_title}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {selectedRecipe && (
                <>
                    <h3 className="mt-4 mb-2 overflow-hidden">ingredient modifications:</h3>
                    {ingredientFields.map((field, index) => (
                        <ModificationItem
                            key={field.id}
                            items={ingredientData || []}
                            placeholder="enter your ingredient modification"
                            index={index}
                            type="ingredient"
                        />
                    ))}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            appendIngredient({ originalIngredient: '', modifiedIngredient: '' });
                        }} 
                        className="mb-4 justify-self-end text-left hover:underline cursor-pointer"
                    >
                        add another ingredient modification
                    </button>

                    <h3 className="mt-4 mb-2 overflow-hidden">instruction modifications:</h3>
                    {instructionFields.map((field, index) => (
                        <ModificationItem
                            key={field.id}
                            items={instructionData || []}
                            placeholder="enter your instruction modification"
                            index={index}
                            type="instruction"
                        />
                    ))}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            appendIngredient({ originalInstruction: '', modifiedInstruction: '' });
                        }}
                        className="mb-4 justify-self-end text-left hover:underline cursor-pointer">
                    
                        add another instruction modification
                    </button>
                </>
            )}
        </div>
    )
}

export default RecipeDropDown
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function RecipeCard() {
    const navigate = useNavigate()
    return (
      <div className="card card-side bg-base-100 shadow-xl w-350 standardBorder overflow-hidden">
        <figure>
          <img
            src="src/assets/TempImage.jpg"
            alt="recipe image" className='recipeBoxCardImg' />
        </figure>
        <div className="card-body card-compact bg-primary overflow-hidden text-secondary h-full">
          <h2 className="card-title">brownies</h2>
          <p>ready in 45 minutes</p>
          <div className="card-actions justify-end">
            <button className="btn bg-accent" onClick={() => navigate('/recipeid')}>bake</button>
          </div>
        </div>
      </div>
    )
}

export default RecipeCard
import '../../App.css'
import {useNavigate} from 'react-router-dom'

function PageTitle(props) {
  const navigate = useNavigate();

  const userData = { "userName" : props.pageTitle[0], "userId" : props.userId}
  const toUserProfile =() => {
    navigate(props.path[0], {state: userData})
  }
  const recipeData = { "recipeName" : props.pageTitle[1], "recipeId" : props.recipeId}

  const toRecipeProfile =() => {
  navigate(props.path[1], {state: recipeData})
}

  if (props.path) {
    return (
      <div className='pageTitle ml-2.5 md:text-xl'>
        <a onClick={()=>{toUserProfile()}}>{props.pageTitle[0]}</a> made <a onClick={()=>{toRecipeProfile()}}>{props.pageTitle[1]}</a>
      </div>
    )
}
else {
  return (
    <div className='pageTitle md:text-xl'>{props.pageTitle}</div>
  )
}
}

export default PageTitle
import '../../App.css'
import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

function PageTitle(props) {

  const navigate = useNavigate();


  const userData = { "userName" : props.pageTitle[0], "userId" : props.userId}
  const toUserProfile =() => {
    navigate(props.path[0], {state: userData})
  }

  console.log(userData)

  const recipeData = { "recipeName" : props.pageTitle[1], "recipeId" : props.recipeId}

  const toRecipeProfile =() => {
  navigate(props.path[1], {state: recipeData})
}


  if (props.path) {
    return (
      <div className='pageTitle'>
        <a onClick={()=>{toUserProfile()}}>{props.pageTitle[0]}</a> made <a onClick={()=>{toRecipeProfile()}}>{props.pageTitle[1]}</a>
      </div>
    )
}
else {
  return (
    <div className='pageTitle'>{props.pageTitle}</div>
  )
}
}

export default PageTitle
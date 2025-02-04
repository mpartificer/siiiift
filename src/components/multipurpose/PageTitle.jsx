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
      <div className='pageTitle ml-2.5 md:text-xl hover:text-primary'>
        <a className='hover:text-primary font-semibold hover:cursor-pointer'onClick={()=>{toUserProfile()}}>{props.pageTitle[0]}</a> made <a className='font-semibold hover:text-primary hover:cursor-pointer'onClick={()=>{toRecipeProfile()}}>{props.pageTitle[1]}</a>
      </div>
    )
}
else {
  return (
    <div className='pageTitle md:text-xl hover:text-primary hover:cursor-pointer'>{props.pageTitle}</div>
  )
}
}

export default PageTitle
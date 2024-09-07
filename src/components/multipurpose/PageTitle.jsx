import '../../App.css'
import { Link } from 'react-router-dom'

function PageTitle(props) {
  const propInsert = props.modificationList;

  if (props.path) {
    return (
      <div className='pageTitle'>
        <Link to={props.path[0]}>{props.pageTitle[0]}</Link> made <Link to={props.path[1]}>{props.pageTitle[1]}</Link>
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
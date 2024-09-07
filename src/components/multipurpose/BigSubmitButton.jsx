import '../../App.css'
import { Router} from 'react-router-dom'
import { Link } from 'react-router-dom';

function BigSubmitButton(props) {
    const submitValue = props;
    const path = props.path;
  
    return (
      <Router>
        <Link to={path}>
          <button className='bigSubmitButton' >{props.submitValue}</button>
        </Link>
      </Router>
    )
}

export default BigSubmitButton

import '../../App.css'
import { useNavigate } from 'react-router-dom';

function BigSubmitButton(props) {
    const path = props.path;
    const navigate = useNavigate();
  
    return (
          <button className='bigSubmitButton' onClick={() => navigate(path)}>{props.submitValue}</button>
    )
}

export default BigSubmitButton

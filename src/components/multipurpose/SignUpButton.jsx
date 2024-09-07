import '../../App.css';
import { useNavigate } from 'react-router-dom';

function SignUpButton(props) {
    const navigate = useNavigate()
    return (
      <button className='signUpButton' onClick={() => navigate(props.path)}>{props.signUpLinkText}</button>
    )
}

export default SignUpButton;
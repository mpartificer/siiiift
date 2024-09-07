import '../App.css';

function SignUpButton(props) {
    const signUpLinkText = props;
    return (
      <button className='signUpButton'>{props.signUpLinkText}</button>
    )
}

export default SignUpButton;
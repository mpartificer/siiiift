import '../App.css';

function LogInGreeting(props) {
    const openingTitle = props;
    return (
      <div className='logInGreeting'>{props.openingTitle}</div>
    )
}

export default LogInGreeting;
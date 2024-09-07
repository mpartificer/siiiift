import '../App.css'


function LogInView() {
    return (
      <div className='logInView'>
        <LogInGreeting openingTitle='get siiiift-ing' />
        <LoginEntry entryValue='username' />
        <LoginEntry entryValue='password' />
        <BigSubmitButton submitValue='submit' />
        <SignUpButton signUpLinkText='sign up' />
        <SignUpButton signUpLinkText='forgot password?' />
      </div>
    )
  }

  export default LogInView

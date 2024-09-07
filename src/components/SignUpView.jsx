import '../../App.css'

function SignUpView() {
    return (
      <div className='logInView'>
        <LogInGreeting openingTitle='siiiift' />
        <LoginEntry entryValue='username' />
        <LoginEntry entryValue='password' />
        <LoginEntry entryValue='reenter password' />
        <BigSubmitButton submitValue='sign up' path="/postyourbake" />
      </div>
    )
  }

  export default SignUpView
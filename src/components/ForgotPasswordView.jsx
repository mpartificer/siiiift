import '../App.css'

function ForgotPasswordView() {
  return (
    <div className='logInView'>
      <LogInGreeting openingTitle='siiiift' />
      <LogInSubGreeting />
      <LoginEntry entryValue='username' />
      <BigSubmitButton submitValue='enter' />
    </div>
  )
}

export default ForgotPasswordView

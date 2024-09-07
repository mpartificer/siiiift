import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LogInSubGreeting from './multipurpose/LogInSubGreeting.jsx'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import LoginEntry from './multipurpose/LoginEntry.jsx'

function ForgotPasswordView() {
  return (
    <div className='logInView'>
      <LogInGreeting openingTitle='siiiift' />
      <LogInSubGreeting />
      <LoginEntry entryValue='username' />
      <BigSubmitButton submitValue='enter' path='/login'/>
    </div>
  )
}

export default ForgotPasswordView

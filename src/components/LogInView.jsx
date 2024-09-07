import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LoginEntry from './multipurpose/LoginEntry.jsx'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import SignUpButton from './multipurpose/SignUpButton.jsx'

function LogInView() {
    return (
      <div className='logInView'>
        <LogInGreeting openingTitle='get siiiift-ing' />
        <LoginEntry entryValue='username' />
        <LoginEntry entryValue='password' />
        <BigSubmitButton submitValue='submit' path='/'/>
        <SignUpButton signUpLinkText='sign up' path='/signup'/>
        <SignUpButton signUpLinkText='forgot password?' path='/login/forgot-password'/>
      </div>
    )
  }

  export default LogInView

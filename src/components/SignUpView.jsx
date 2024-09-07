import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LoginEntry from './multipurpose/LoginEntry.jsx'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import Footer from './multipurpose/Footer.jsx'


function SignUpView() {
    return (
      <div className='logInView'>
        <LogInGreeting openingTitle='siiiift' />
        <LoginEntry entryValue='username' />
        <LoginEntry entryValue='password' />
        <LoginEntry entryValue='reenter password' />
        <BigSubmitButton submitValue='sign up' path="/" />
        <Footer />
      </div>
    )
  }

  export default SignUpView
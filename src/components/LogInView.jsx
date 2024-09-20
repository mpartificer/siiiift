import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LoginEntry from './multipurpose/LoginEntry.jsx'
import SignUpButton from './multipurpose/SignUpButton.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'

function LogInView() {

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    console.log(email, password)
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  navigate('/')
  }

    return (
      <form className='logInView' onSubmit={handleSignIn}>
        <LogInGreeting openingTitle='get siiiift-ing' />
        <input className='loginBar' type='text' placeholder='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='loginBar' type='text' placeholder='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className='bigSubmitButton' disabled={loading}>{loading ? 'Loading...' : 'login'}</button>
        <SignUpButton signUpLinkText='sign up' path='/signup'/>
        <SignUpButton signUpLinkText='forgot password?' path='/login/forgot-password'/>
      </form>
    )
  }

  export default LogInView

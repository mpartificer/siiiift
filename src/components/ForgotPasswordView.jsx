import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LogInSubGreeting from './multipurpose/LogInSubGreeting.jsx'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import {useNavigate} from 'react-router-dom'

function ForgotPasswordView() {

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const handlePasswordReset = async (e) => {
    console.log(email)
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) alert(error.message)
    setLoading(false)
  }
  return (
    <form className='logInView' onSubmit={handlePasswordReset}>
      <LogInGreeting openingTitle='siiiift' />
      <LogInSubGreeting />
      <input className='loginBar' type='text' placeholder='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <button type="submit" className='bigSubmitButton' disabled={loading}>{loading ? 'loading...' : 'login'}</button>
      </form>
  )
}

export default ForgotPasswordView

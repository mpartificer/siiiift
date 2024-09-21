import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import { supabase } from '../supabaseClient.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'



function SignUpView() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reenter_password, setReenter_password] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()



  const handleSignUp = async (e) => {
       e.preventDefault()
       setLoading(true)
       try {
        if (password !== reenter_password) {
          throw new Error('Passwords do not match')
        }
        console.log('Attempting signup with:', { email, password }) // Log the data being sent

        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          console.error('Error signing up:', error)
          throw error
        }

        console.log('Signup successful:', data)
        alert('Check your email for the confirmation link!')

        //Postgres function that can run off of your database
        //userId changes 

        navigate('/')
         // Log the response data
      } catch (error) {
        console.error('Caught error:', error)
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }
    return (
      <form className='logInView' onSubmit={handleSignUp}>
        <LogInGreeting openingTitle='siiiift' />
        <input className='loginBar' type='text' placeholder='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='loginBar' type='text' placeholder='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className='loginBar' type='text' placeholder='reenter password' name='reenter_password' id='reenter_password' value={reenter_password} onChange={(e) => setReenter_password(e.target.value)}/>
        <button className='bigSubmitButton' type="submit" disabled={loading}>{loading ? 'Loading...' : 'sign up'}</button>
      </form>
    )
  }

  export default SignUpView
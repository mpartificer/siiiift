import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import { supabase } from '../supabaseClient.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define the validation schema
const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  reenter_password: z
    .string()
    .min(1, { message: 'Please confirm your password' })
}).refine((data) => data.password === data.reenter_password, {
  message: "Passwords don't match",
  path: ["reenter_password"]
})

function SignUpView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      reenter_password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Error signing up:', error)
        throw error
      }

      alert('Check your email for the confirmation link!')
      navigate('/login')

    } catch (error) {
      console.error('Caught error:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='logInView' onSubmit={handleSubmit(onSubmit)}>
      <LogInGreeting openingTitle='siiiift' />
      
      <div>
        <input
          className='loginBar'
          type='text'
          placeholder='email'
          {...register('email')}
        />
        {errors.email && (
          <p className='error-message'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          className='loginBar'
          type='password'
          placeholder='password'
          {...register('password')}
        />
        {errors.password && (
          <p className='error-message'>{errors.password.message}</p>
        )}
      </div>

      <div>
        <input
          className='loginBar'
          type='password'
          placeholder='reenter password'
          {...register('reenter_password')}
        />
        {errors.reenter_password && (
          <p className='error-message'>{errors.reenter_password.message}</p>
        )}
      </div>

      <button 
        className='bigSubmitButton' 
        type="submit" 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'sign up'}
      </button>
    </form>
  )
}

export default SignUpView
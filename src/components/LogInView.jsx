import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import SignUpButton from './multipurpose/SignUpButton.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../AuthContext.jsx'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
})

function LogInView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { data: signInData, error } = await signIn({
        email: data.email,
        password: data.password
      })
      
      if (error) {
        throw error
      }

      
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='logInView' onSubmit={handleSubmit(onSubmit)}>
      <LogInGreeting openingTitle='get siiiift-ing' />
      
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

      <button type="submit" className='bigSubmitButton' disabled={loading}>
        {loading ? 'loading...' : 'login'}
      </button>
      
      <SignUpButton signUpLinkText='sign up' path='/signup'/>
      <SignUpButton signUpLinkText='forgot password?' path='/login/forgot-password'/>
    </form>
  )
}

export default LogInView
import '../App.css'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'
import LogInSubGreeting from './multipurpose/LogInSubGreeting.jsx'
import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' })
})

function ForgotPasswordView() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email)
      if (error) throw error
      
      // Optionally show a success message or redirect
      alert('Password reset email sent! Please check your inbox.')
      navigate('/login') // Optional: redirect to login page
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='logInView' onSubmit={handleSubmit(onSubmit)}>
      <LogInGreeting openingTitle='siiiift' />
      <LogInSubGreeting />
      
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

      <button 
        type="submit" 
        className='bigSubmitButton' 
        disabled={loading}
      >
        {loading ? 'loading...' : 'send reset'}
      </button>
    </form>
  )
}

export default ForgotPasswordView
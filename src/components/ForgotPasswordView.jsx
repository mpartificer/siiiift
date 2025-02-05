import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import LogInGreeting from './multipurpose/LogInGreeting.jsx'

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

      if (error) {
        throw error
      }

      alert('Check your email for the password reset link!')
      navigate('/login')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='logInView' onSubmit={handleSubmit(onSubmit)}>
      <LogInGreeting openingTitle='reset password' />
      
      <div>
        <input
          className='loginBar'
          type='email'
          placeholder='email'
          {...register('email')}
        />
        {errors.email && (
          <p className='error-message'>{errors.email.message}</p>
        )}
      </div>

      <button 
        className='bigSubmitButton' 
        type="submit" 
        disabled={loading}
      >
        {loading ? 'loading...' : 'send login link'}
      </button>
    </form>
  )
}

export default ForgotPasswordView
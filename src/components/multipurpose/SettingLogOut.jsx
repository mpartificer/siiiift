import { useNavigate } from 'react-router-dom'
import {supabase} from '../../supabaseClient.js'
import { useState } from 'react'

function SettingLogOut(props) {
    const navigate = useNavigate()
  
    const [loading, setLoading] = useState(false)
  
    const handleLogOut = async (e) => {
      e.preventDefault()
      setLoading(true)
  
      try {
      const { error } = await supabase.auth.signOut()
    
      if (error) alert(error.message)
        setLoading(false)
      navigate('/login')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
    }
      return (
        <form className='settingNoToggle' onSubmit={handleLogOut}>
          <button type="submit">{props.settingName}</button>
        </form>
      )
    }

    export default SettingLogOut
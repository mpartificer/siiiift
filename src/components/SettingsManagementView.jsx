import '../App.css'
import Toggle from './multipurpose/Toggle.jsx'
import { Image } from 'lucide-react'
import HeaderFooter from './multipurpose/HeaderFooter.jsx'
import { useState, useEffect } from 'react'
import SettingLogOut from './multipurpose/SettingLogOut.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'



function EditBio(props) {
    return (
      <div className='upperBioFlexParent'>
        <Image size={100} color="#192F01"/>
        <TextAreaWithButton userBio={props.userBio} />
      </div>
    )
  }

  function TextAreaWithButton(props) {
    let [userBio, setUserBio] = useState('')
    userBio = props.userBio

    let textArea = <textarea className="textarea grow h-full overflow-x-hidden bg-secondary" value={userBio} onChange={(e) => setUserBio(e.target.value)}></textarea>

    const handleSubmit = (e) => {
      e.preventDefault()
      console.log(userBio)
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2 bg-secondary profileBlurb h-full">
          {textArea}          
          <button type="submit"className='btn btn-primary self-end justify-self-end'>save</button>
        </label>
      </form>
    )
  }
  
function SettingWithToggle(props) {
    return (
      <div className='settingWithToggle'>
        {props.settingName}
        <Toggle justify='justify-end' />
      </div>
    )
  }


function SettingsManagementView(props) {

  const location = useLocation();
  const userId = location.state.userId;

  const [userDetails, setUserDetails] = useState('');
  const [isLoading, setIsLoading] = useState('true')

  useEffect(() => {
    let isMounted = true;

    async function setUserData() {
      try {
        console.log(userId)
        setIsLoading(true)
        const {userResponse, error} = await
          supabase
            .from('user_profile')
            .select('*')
            .eq('user_auth_id', userId)

          if (isMounted) {
            setUserDetails(userResponse)
            console.log(userDetails)
            setIsLoading(false)
          }
      }
      catch (error) {
        console.error(error)
    }
  }

  setUserData();

  return () => {
    isMounted = false;
  };}

,[])

    console.log(userDetails)
    return (
      <div className='w-350 md:w-5/6 '>
        <HeaderFooter />
          <div className="mt-14 mb-14 settingsManagementView align-center">
            <div className='pageTitle'>username</div>
            <EditBio userBio="" />
            <SettingWithToggle settingName='toggle AI insights' />
            <SettingLogOut settingName='log out' path='/login'/>
          </div>
      </div>
    )
  }

  export default SettingsManagementView
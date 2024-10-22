import '../App.css'
import Toggle from './multipurpose/Toggle.jsx'
import { Image } from 'lucide-react'
import PageTitle from './multipurpose/PageTitle.jsx'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { useState, useEffect } from 'react'
import SettingLogOut from './multipurpose/SettingLogOut.jsx'
import { useNavigate } from 'react-router-dom'
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

  function SettingReviewFollowers(props) {
    const navigate = useNavigate()
      return (
        <div className='settingNoToggle'>
          <button type="submit" onClick={() => navigate(props.path)}>{props.settingName}</button>
        </div>
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

  const [authDetails, setAuthDetails] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [isLoading, setIsLoading] = useState('true')

  useEffect(() => {
    let isMounted = true;

    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (isMounted) {
        setAuthDetails(user)
        setIsLoading(false)
        setUserData();
        }
        if (user.error) throw user.error

      }catch (error) {
        console.error('Error fetching user_profile:', error);
        setIsLoading(false)
      }

}

    async function setUserData() {
      try {
        setIsLoading(true)
        const {userResponse, error} = await
          supabase
            .from('user_profile')
            .select('*')
            .eq('user_auth_id', authDetails.id)


          if (isMounted) {
            setUserDetails(userResponse)
            setIsLoading(false)
          }
      }
      catch (error) {
        console.error(error)
    }
  }

  getUserData();

  return () => {
    isMounted = false;
  };}

)

    console.log(userDetails)
    return (
      <div className='settingsManagementView max-w-350'>
        <Header />
        <PageTitle pageTitle='username' />
        <EditBio userBio="this is my bio" />
        <SettingWithToggle settingName='toggle AI insights' />
        <SettingLogOut settingName='log out' path='/login'/>
        <Footer />
      </div>
    )
  }

  export default SettingsManagementView
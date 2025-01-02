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
      <div className='flex flex-row md:flex-col justify-between w-350 md:gap-4'>
        <img 
          src={props.photo}
          alt="recipe" 
          className='w-36 h-36 md:w-80 md:h-80 gap-4 standardBorder object-cover'
        />
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
        <label className="input input-bordered flex items-center gap-2 bg-secondary profileBlurb h-full md:w-80">
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
    fetchUserDetails();
    console.log(userDetails)
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_auth_id', userId)
        .single();

      if (error) throw error;

      setUserDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user_profile:', error);
      setIsLoading(false);
    }
  };

    return (
      <div className='w-350 md:w-5/6 align-center'>
        <HeaderFooter />
          <div className="flex flex-col md:flex-row gap-5 mt-14 mb-14 self-center ">
            <div className="flex flex-col flex-wrap justify-items-end">
            <div className='pageTitle text-xl md:text-3xl justify-self-start md:justify-self-end'>{userDetails.username}</div>
            <EditBio userBio={userDetails.bio} photo={userDetails.photo}/>
            </div>
            <div className="flex flex-col w-350 gap-5 md:mt-8">
              <SettingWithToggle settingName='toggle AI insights' />
              <SettingLogOut settingName='log out' path='/login'/>
            </div>
          </div>
      </div>
    )
  }

  export default SettingsManagementView
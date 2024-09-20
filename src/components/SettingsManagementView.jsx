import '../App.css'
import Toggle from './multipurpose/Toggle.jsx'
import { Image } from 'lucide-react'
import PageTitle from './multipurpose/PageTitle.jsx'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'

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
  
function SettingNoToggle(props) {
    return (
      <div className='settingNoToggle'>
        <Link to={props.path}>{props.settingName}</Link>
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
    return (
      <div className='settingsManagementView max-w-350'>
        <Header />
        <PageTitle pageTitle='username' />
        <EditBio userBio="this is my bio" />
        <SettingWithToggle settingName='public/private' />
        <SettingNoToggle settingName='review follow requests' path='/profile/settings/follow-requests'/>
        <SettingWithToggle settingName='toggle AI insights' />
        <SettingNoToggle settingName='log out' path='/login'/>
        <Footer />
      </div>
    )
  }

  export default SettingsManagementView
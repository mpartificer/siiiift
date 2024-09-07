import '../App.css'
import Toggle from './multipurpose/Toggle.jsx'
import { Image } from 'lucide-react'
import PageTitle from './multipurpose/PageTitle.jsx'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import { Link } from 'react-router-dom'

function EditBio() {
    return (
      <div className='upperBioFlexParent'>
        <Image size={100} color="#192F01"/>
        <textarea className='profileBlurb' />
      </div>
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
        <EditBio />
        <SettingWithToggle settingName='public/private' />
        <SettingNoToggle settingName='review follow requests' path='/profile/settings/follow-requests'/>
        <SettingWithToggle settingName='toggle AI insights' />
        <SettingNoToggle settingName='log out' path='/login'/>
        <Footer />
      </div>
    )
  }

  export default SettingsManagementView
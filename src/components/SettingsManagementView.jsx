import '../App.css'
import Toggle from './multipurpose/Toggle.jsx'
import { Image } from 'lucide-react'
import PageTitle from './multipurpose/PageTitle.jsx'
import Header from './multipurpose/Header.jsx'

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
        {props.settingName}
      </div>
    )
  }
  
function SettingWithToggle(props) {
    return (
      <div className='settingWithToggle'>
        {props.settingName}
        <Toggle />
      </div>
    )
  }

function SettingsManagementView(props) {
    return (
      <div className='settingsManagementView'>
        <Header />
        <PageTitle pageTitle='username' />
        <EditBio />
        <SettingWithToggle settingName='public/private' />
        <SettingNoToggle settingName='review follow requests' />
        <SettingWithToggle settingName='toggle AI insights' />
        <SettingNoToggle settingName='log out' />
      </div>
    )
  }

  export default SettingsManagementView
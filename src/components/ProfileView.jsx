import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import Header from './multipurpose/Header.jsx'

function SettingsButton() {
    return(
      <div className='settingsButton'>
        <Settings size={24} color='#192F01'/>
      </div>
    )
}
  
function ProfileBlurb(props) {
    const profileDescription = props;
    return (
      <div className='profileBlurb'>
        {props.profileDescription}
      </div>
    )
}
  
function ProfileSummary() {
    return (
      <div className='profileSummary'>
        <FollowBar>
          <FollowTab measure="followers"/>
          <FollowTab measure="following"/>
          <FollowTab measure="bakes"/>
        </FollowBar>
        <ProfileBlurb profileDescription="jusalittlesomething"/>
      </div>
    )
}
  
function ProfilePlateTop(props) {
    return (
      <div className='profilePlateTop'>
        {props.children}
      </div>
    )
}
  
function ProfilePlateBottom(props) {
    return (
      <div className='profilePlateBottom'>
        {props.children}
      </div>
    )
}
  
function ProfilePlate() {
    return (
      <div className='profilePlate'>
        <Header />
        <ProfilePlateTop>
          <PageTitle />
          <SettingsButton />
        </ProfilePlateTop>
        <ProfilePlateBottom>
          <User size={140} color='#192F01'/>
          <ProfileSummary />
        </ProfilePlateBottom>
      </div>
    )
}

function ProfileView() {
  return (
    <div>
      <ProfilePlate />
    </div>
  )
}

export default ProfileView
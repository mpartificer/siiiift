import FollowBar from '../components/multipurpose/FollowBar.jsx'
import FollowTab from '../components/multipurpose/FollowTab.jsx'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import Header from './multipurpose/Header.jsx'
import Footer from './multipurpose/Footer.jsx'
import PageTitle from './multipurpose/PageTitle.jsx'
import { useNavigate } from 'react-router-dom';
import '../App.css'

function SettingsButton() {
  const navigate = useNavigate();
    return(
      <div className='settingsButton'>
        <Settings size={24} color='#192F01' onClick={() => navigate('/profile/settings')} />
      </div>
    )
}
  
function ProfileBlurb(props) {
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
          <FollowTab measure="followers" path='/profile/followers'/>
          <FollowTab measure="following" path='/profile/following'/>
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
        <ProfilePlateTop>
          <PageTitle pageTitle="username" path={null} />
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
      <Header />
      <ProfilePlate />
      <Footer />
    </div>
  )
}

export default ProfileView
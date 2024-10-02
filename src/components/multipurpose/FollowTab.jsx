import '../../App.css'
import {useNavigate} from 'react-router-dom'

function FollowTab(props) {

  const navigate = useNavigate();
  const followerPath = `/profile/${props.username}/followers`
  const followingPath = `/profile/${props.username}/following`
  const bakePath = `/profile/${props.username}`

  const userData = { "userName" : props.username, "userId" : props.userId, "measure" : props.measure }
  const toUserFollowers =() => {
    navigate(followerPath, {state: userData})
  }

  const toUserFollowing =() => {
    navigate(followingPath, {state: userData})
  }

  const toUserProfile = () => {
    navigate(bakePath, {state: userData})
  }

  if (props.measure === 'following') {
    return (
      <div className='followTab' onClick={()=>{toUserFollowing()}}>
        {props.number} <br />{props.measure}
      </div>
    )
  }
  else if (props.measure === 'followers') {
    return (
      <div className='followTab' onClick={()=>{toUserFollowers()}}>
      {props.number} <br />{props.measure}
    </div>
    )
  }

  else {
    return (
      <div className='followTab' onClick={()=>{toUserProfile()}}>
      {props.number} <br />{props.measure}
    </div>
    )
  }
  }

export default FollowTab
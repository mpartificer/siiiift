
import '../../App.css'

function FollowTab(props) {
    const {number, measure} = props;
    return (
      <div className='followTab'>
        {props.number} <br />{props.measure}
      </div>
    )
  }

export default FollowTab
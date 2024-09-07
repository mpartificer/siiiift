
import '../../App.css'
import { useNavigate } from 'react-router-dom';

function FollowTab(props) {
    const {number, measure} = props;
    const navigate = useNavigate();
    return (
      <div className='followTab'onClick={() => navigate(props.path)}>
        {props.number} <br />{props.measure}
      </div>
    )
  }

export default FollowTab
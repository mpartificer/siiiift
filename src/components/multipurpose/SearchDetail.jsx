import '../../App.css'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function SearchDetail(props) {
    const searchReturnValue = props;
    const path = props.path;
    const navigate = useNavigate();

    return (
      <div className='searchDetail' onClick={() => navigate(path)}>
        <User size={50} color='#EADDFF' /> {props.searchReturnValue}
      </div>
    )
  }

  export default SearchDetail
import '../../App.css'
import { User } from 'lucide-react'

function SearchDetail(props) {
    const searchReturnValue = props;
    return (
      <div className='searchDetail'>
        <User size={50} color='#EADDFF' /> {props.searchReturnValue}
      </div>
    )
  }

  export default SearchDetail
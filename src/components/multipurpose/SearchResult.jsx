import '../../App.css'
import SearchButton from './SearchButton.jsx'
import SearchDetail from './SearchDetail.jsx'

function SearchResult(props) {
    return (
      <div className='searchResult'>
        <SearchDetail searchReturnValue={props.searchReturnValue}/>
        <SearchButton buttonValue={props.buttonValue}/>
      </div>
    )
  }

export default SearchResult
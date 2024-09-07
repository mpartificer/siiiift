import '../App.css'
import Header from './multipurpose/Header.jsx'
import SearchBar from './multipurpose/SearchBar.jsx'
import SearchResult from './multipurpose/SearchResult.jsx'
import Footer from './multipurpose/Footer.jsx'


function SearchFilter(props) {
    const filterValue = props;
    return (
      <button className='searchFilter'>{props.filterValue}</button>
    )
  }
  
function SearchFilterBar() {
    return (
      <div className='searchFilterBar'>
        <SearchFilter filterValue='users' />
        <SearchFilter filterValue='recipes' />
      </div>
    )
  }


function SearchView() {
    return (
      <div className='followersView'>
        <Header />
        <SearchBar />
        <SearchFilterBar />
        <SearchResult searchReturnValue="username" buttonValue="follow" path="/profile" />
        <SearchResult searchReturnValue="username" buttonValue="follow" path="/profile" />
        <SearchResult searchReturnValue="username" buttonValue="follow" path="/profile" />
        <Footer />
      </div>
    )
  }

  export default SearchView
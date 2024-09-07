import '../App.css'
import Header from './multipurpose/Header.jsx'
import FollowBar from './multipurpose/FollowBar.jsx'
import FollowTab from './multipurpose/FollowTab.jsx'
import SearchBar from './multipurpose/SearchBar.jsx'
import SearchResult from './multipurpose/SearchResult.jsx'
import Footer from './multipurpose/Footer.jsx'

function FollowersView() {
    return (
      <div className='followersView'>
        <Header />
        <FollowBar>
          <FollowTab number="43" measure="followers"/>
          <FollowTab number="43" measure="following"/>
          <FollowTab number="43" measure="bakes"/>
        </FollowBar>
        <SearchBar />
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <SearchResult searchReturnValue="username" buttonValue="follow"/>
        <Footer />
      </div>
    )
  }

  export default FollowersView
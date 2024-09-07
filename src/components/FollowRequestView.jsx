import '../../App.css'
import { Header } from './multipurpose/Header.jsx'
import { PageTitle } from './multipurpose/PageTitle.jsx'
import { SearchBar } from './multipurpose/SearchBar.jsx'
import { SearchResult } from './multipurpose/SearchResult.jsx'

function FollowRequestView() {
    return (
      <div className='followersView'>
        <Header />
        <PageTitle pageTitle='follow requests' />
        <SearchBar />
        <SearchResult searchReturnValue="username" buttonValue="accept"/>
        <SearchResult searchReturnValue="username" buttonValue="accept"/>
        <SearchResult searchReturnValue="username" buttonValue="accept"/>
      </div>
    )
  }

  export default FollowRequestView
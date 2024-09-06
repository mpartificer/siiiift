import { useState } from 'react'
import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { House } from 'lucide-react'
import { Search } from 'lucide-react'
import { Plus } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import { Heart } from 'lucide-react';
import { MessageCircle} from 'lucide-react'
import { History } from 'lucide-react'
import { Croissant } from 'lucide-react'
import { Image } from 'lucide-react'



function CheckBox(props) {
  return (
    <div className="form-control bottomPanel">
      <label className="cursor-pointer label">
        <span>confirm {props.confirmRecipeItem}?</span>
        <input type="checkbox" className="checkbox checkbox-success" />
      </label>
    </div>
  )
}

function RecipeCheckPanel(props) {
  const propInsert = props.propInsert;
  const myComponentList = propInsert.map((item, index) => (
    <li key={index}>{item}</li>));

  return (
    <div className='recipeCheckPanel'>
      <RecipeCheckTitle recipeCheckTitle={props.confirmRecipeItem} />
      <ul className='recipeCheckPanelList'>
      {myComponentList}
      </ul>
      <CheckBox confirmRecipeItem={props.confirmRecipeItem} />
    </div>
  )
}

function RecipeCheckTitle(props) {
  return (
    <div className='recipeCheckTitle'>
      {props.recipeCheckTitle}
    </div>
  )
}

function PostReactionBox() {
  return (
    <div className='postReactionBox'>
      <Heart size={40} color='#192F01'/>
      <MessageCircle size={40} color='#192F01'/>
      <History size={40} color='#192F01'/>
    </div>
  )
}


function SearchBar() {
  return (
    <input type="text" placeholder="search" className="searchBar"/>
  )
}

function BigSubmitButton(props) {
  const submitValue = props;
  return (
    <button className='bigSubmitButton'>{props.submitValue}</button>
  )
}

function Header() {
  return (
    <div className='header'>
      siiiift
    </div>
  )
}

function Footer() {
  return(
    <>
      <div className="footer btm-nav">
        <button className='navIcons'>
          <House size={36} color="#FAE2D5" />
        </button>
        <button className='navIcons'>
          <Search size={36} color="#FAE2D5"/>
        </button>
        <button className='navIcons'>
          <Plus size={36} color="#FAE2D5"/>
        </button>
        <button className='navIcons'>
          <BookOpen size={36} color="#FAE2D5"/>
        </button>
        <button className='navIcons'>
          <User size={36} color="#FAE2D5"/>
        </button>
      </div>
    </>
  )
}

function PageTitle(props) {
  const pageTitle = props;
  return (
    <div className='pageTitle'>
      {props.pageTitle}
    </div>
  )
}

function LogInGreeting(props) {
  const openingTitle = props;
  return (
    <div className='logInGreeting'>{props.openingTitle}</div>
  )
}

function LogInSubGreeting() {
  return (
    <div className='logInSubGreeting'>
      forgot password?
    </div>
  )
}

function SignUpButton(props) {
  const signUpLinkText = props;
  return (
    <button className='signUpButton'>{props.signUpLinkText}</button>
  )
}

function LoginEntry(props) {
  const entryValue = props;
  return (
    <input type="text" placeholder={props.entryValue} className="loginBar"/>
  )
}

function SettingsButton() {
  return(
    <div className='settingsButton'>
      <Settings size={24} color='#192F01'/>
    </div>
  )
}

function ProfileBlurb(props) {
  const profileDescription = props;
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
        <FollowTab measure="followers"/>
        <FollowTab measure="following"/>
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
      <Header />
      <ProfilePlateTop>
        <PageTitle />
        <SettingsButton />
      </ProfilePlateTop>
      <ProfilePlateBottom>
        <User size={140} color='#192F01'/>
        <ProfileSummary />
      </ProfilePlateBottom>
    </div>
  )
}

function FollowTab(props) {
  const {number, measure} = props;
  return (
    <div className='followTab'>
      {props.number} <br />{props.measure}
    </div>
  )
}

function FollowBar(props) {
  return (
    <div className='followBar'>
      {props.children}
    </div>
  )
}

function SearchDetail(props) {
  const searchReturnValue = props;
  return (
    <div className='searchDetail'>
      <User size={50} color='#EADDFF' /> {props.searchReturnValue}
    </div>
  )
}

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

function SearchButton(props) {
  const buttonValue = props;
  return (
    <button className='searchResultButton'>{props.buttonValue}</button>
  )
}

function SearchResult(props) {
  return (
    <div className='searchResult'>
      <SearchDetail searchReturnValue={props.searchReturnValue}/>
      <SearchButton buttonValue={props.buttonValue}/>
    </div>
  )
}

function EditBio() {
  return (
    <div className='upperBioFlexParent'>
      <Image size={100} color="#192F01"/>
      <textarea className='profileBlurb' />
    </div>
  )
}

function SettingNoToggle(props) {
  return (
    <div className='settingNoToggle'>
      {props.settingName}
    </div>
  )
}

function SettingWithToggle(props) {
  return (
    <div className='settingWithToggle'>
      {props.settingName}
      <Toggle />
    </div>
  )
}

function Toggle() {
  return (
    <div className="form-control w-52">
    <label className="label cursor-pointer">
      <input type="checkbox" className="toggle toggle-accent" defaultChecked />
    </label>
  </div>
  )
}

function PostSettingTitle(props) {
 return (
  <div className='recipeCheckTitle'>{props.settingTitle}</div>
 )
}

function ModificationDropDown(props) {
  const propInsert = props.modificationList;
  const myComponentList = propInsert.map((item, index) => (
    <li key={index}>{item}</li>));
  return (
    <div className="dropdown profilePlate">
      <PostSettingTitle settingTitle='modifications:' />
      <div tabIndex={0} role="button" className="btn m-1 w-80 modificationDropDown">choose a step to modify</div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow modificationDropDown ">
        {myComponentList}
      </ul>
    </div>
  )
}

function ModificationRating() {
  return (
    <div className='profilePlateTop'>
      <PostSettingTitle settingTitle='rate:' />
      <ModificationRatingSystem />
    </div>
  )
}

function ModificationRatingSystem() {
  return (
    <div className="rating">
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" defaultChecked />
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" />
      <input type="radio" name="rating-1" className="mask mask-star" />
    </div>
  )
}

function DayMonthDateEntry() {
  return (
    <div className='dayMonthDateEntry w-1/4'>
      <input type="text" placeholder="" className='w-1/4'/>
    </div>
  )
}

function YearDateEntry() {
  return (
    <div className='yearDateEntry w-1/2'>
      <input type="text" placeholder="year" className='w-1/2' />
    </div>
  )
}

function BakePostDate() {
  return (
    <div className='profilePlateTop'>
      <PostSettingTitle settingTitle='date of bake:' />
      <input type="text" placeholder="mo" className='w-1/4 dayMonthDateEntry'/>
      <input type="text" placeholder="da" className='w-1/4 dayMonthDateEntry'/>
      <input type="text" placeholder="year" className='w-1/2 yearDateEntry' />
    </div>
  )
}

function ToggleBox() {
  return (
    <div>
      <Toggle />
      filter by attempted
    </div>
  )
}

function SortByBox() {
  return (
    <div className="dropdown dropdown-bottom">
      <div tabIndex={0} role="button" className="btn m-1">sort by</div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
  )
}

// function RecipeBoxHeader() {
//   return (
//     <div className='profilePlateTop'>
//       <PageTitle pageTitle='usernames recipe box' />
//       <Plus size={30} color='#192F01' />
//     </div>
//   )
// }

function RecipeBoxSubHeader() {
  return (
    <div className='profilePlateTop standardMargins'>
      <ToggleBox />
      <SortByBox />
    </div>
  )
}

function RecipeCard() {
  return (
    <div className="card card-side bg-base-100 shadow-xl max-w-96 standardMargins">
      <figure>
        <img
          src="https://cakesbymk.com/wp-content/uploads/2023/01/Template-Size-for-Blog-Photos-15-802x1024.jpg"
          alt="recipe image" className='recipeBoxCardImg' />
      </figure>
      <div className="card-body">
        <h2 className="card-title">brownies</h2>
        <p>ready in 45 minutes</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div>
    </div>
  )
}

function RecipeBoxView() {
  return (
    <div>
      <Header />
      <RecipeBoxHeader />
      <RecipeBoxSubHeader />
      <RecipeCard />
    </div>
  )
}

function PostYourBakeView() {
  return (
    <div className='websiteRetrievalView'>
      <Header />
      <Image size={300} />
      <ModificationDropDown modificationList={['1/2 cup sugar', 'bake for 45 minutes', 'rest the dough']} />
      <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />
      <ModificationRating />
      <BakePostDate />
      <BigSubmitButton submitValue='post'/>
    </div>
  )
}

function SettingsManagementView(props) {
  return (
    <div className='settingsManagementView'>
      <Header />
      <PageTitle pageTitle='username' />
      <EditBio />
      <SettingWithToggle settingName='public/private' />
      <SettingNoToggle settingName='review follow requests' />
      <SettingWithToggle settingName='toggle AI insights' />
      <SettingNoToggle settingName='log out' />
    </div>
  )
}

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
    </div>
  )
}

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

function LogInView() {
  return (
    <div className='logInView'>
      <LogInGreeting openingTitle='get siiiift-ing' />
      <LoginEntry entryValue='username' />
      <LoginEntry entryValue='password' />
      <BigSubmitButton submitValue='submit' />
      <SignUpButton signUpLinkText='sign up' />
      <SignUpButton signUpLinkText='forgot password?' />
    </div>
  )
}

function ForgotPasswordView() {
  return (
    <div className='logInView'>
      <LogInGreeting openingTitle='siiiift' />
      <LogInSubGreeting />
      <LoginEntry entryValue='username' />
      <BigSubmitButton submitValue='enter' />
    </div>
  )
}

function SearchView() {
  return (
    <div className='followersView'>
      <Header />
      <SearchBar />
      <SearchFilterBar />
      <SearchResult searchReturnValue="username" buttonValue="follow"/>
      <SearchResult searchReturnValue="username" buttonValue="follow"/>
      <SearchResult searchReturnValue="username" buttonValue="follow"/>
    </div>
  )
}

function SignUpView() {
  return (
    <div className='logInView'>
      <LogInGreeting openingTitle='siiiift' />
      <LoginEntry entryValue='username' />
      <LoginEntry entryValue='password' />
      <LoginEntry entryValue='reenter password' />
      <BigSubmitButton submitValue='sign up' />
    </div>
  )
}

function HomeView() {
  return (
    <div className='homeCard'>
      <Header />
      <PageTitle pageTitle='username made cupcakes' />
      <Croissant size={390} />
      <PostReactionBox />
    </div>
  )
}

function WebsiteRetrievalView() {
  return (
    <div className='websiteRetrievalView'>
      <Header />
      <SearchBar />
      <RecipeCheckPanel propInsert={['brownies']} confirmRecipeItem='recipe title' />
      <RecipeCheckPanel propInsert={['sugar', 'butter', 'bread']} confirmRecipeItem='ingredients' />
      <RecipeCheckPanel propInsert={['preheat oven', 'roll out dough', 'eat and enjoy']} confirmRecipeItem='instructions' />
      <RecipeCheckPanel propInsert={['45 minutes']} confirmRecipeItem='prep time' />
      <RecipeCheckPanel propInsert={['15 minutes']} confirmRecipeItem='cook time' />
      <RecipeCheckPanel propInsert={['1 hour']} confirmRecipeItem='total time' />
      <RecipeCheckPanel propInsert={['Sallys Baking Addiction']} confirmRecipeItem='original author' />
      <RecipeCheckPanel propInsert={['']} confirmRecipeItem='default image' />
      <BigSubmitButton submitValue='submit' />
    </div>
  )
}

function App() {
  return (
    <div>
      {/* Render your main component here */}
      blah blah blah
      {/* <SignUpView /> */}
    </div>
  );
}

export default App;

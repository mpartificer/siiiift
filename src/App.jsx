import { useState } from 'react'
import './App.css'
import React from 'react'
import daisyui from 'daisyui'
import { House } from 'lucide-react'
import { Search } from 'lucide-react'
import { Plus } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { User } from 'lucide-react'
import {Settings} from 'lucide-react'




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
    <input type="text" placeholder="{props.entryValue}" className="loginBar"/>
  )
}

function SettingsButton() {
  return(
    <div className='settingsButton'>
      <Settings size={24} color='#192F01'/>
    </div>
  )
}

// function ProfileBlurb({profileDescription}) {
//   return (
//     <div className='profileBlurb'>
//       {profileDescription}
//     </div>
//   )
// }

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
      <SearchResult searchReturnValue="username" buttonValue="accept"/>
      <SearchResult searchReturnValue="username" buttonValue="accept"/>
      <SearchResult searchReturnValue="username" buttonValue="accept"/>
    </div>
  )
}

export default SearchView

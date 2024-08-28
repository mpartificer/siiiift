import { useState } from 'react'
import './App.css'
import React from 'react'
import daisyui from 'daisyui'
import { House } from 'lucide-react'
import { Search } from 'lucide-react'
import { Plus } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { User } from 'lucide-react'




function SearchBar() {
  return (
    <input type="text" placeholder="search" className="searchBar"/>
  )
}

function BigSubmitButton() {
  return (
    <button className='bigSubmitButton'>submit</button>
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

function LoginEntry(prop) {
  let entryValue = prop;
  return (
    <input type="text" placeholder="{entryValue}" className="loginBar"/>
  )
}

function PasswordEntry() {
  return (
    <input type="text" placeholder="password" className="loginBar"/>
  )
}

function FollowTab() {
  return (
    <div className='followTab'>
      3 <br />followers
    </div>
  )
}

function FollowBar() {
  return (
    <div className='followBar'>
      <FollowTab />
      <FollowTab />
      <FollowTab />
    </div>
  )
}

function SearchDetail() {
  return (
    <div className='searchDetail'>
      <User size={50} color='#EADDFF' /> username
    </div>
  )
}

function SearchButton() {
  return (
    <button className='searchResultButton'>accept</button>
  )
}

function SearchResult() {
  return (
    <div className='searchResult'>
      <SearchDetail />
      <SearchButton />
    </div>
  )
}

function FollowersView() {
  return (
    <div className='followersView'>
      <FollowBar />
      <SearchBar />
      <SearchResult />
      <SearchResult />
      <SearchResult />
    </div>
  )
}


export default FollowersView

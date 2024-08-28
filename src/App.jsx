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

function UserEntry() {
  return (
    <input type="text" placeholder="username" className="loginBar"/>
  )
}

function PasswordEntry() {
  return (
    <input type="text" placeholder="password" className="loginBar"/>
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


export default SearchResult

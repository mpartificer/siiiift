import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import daisyui from 'daisyui'

function searchBar() {
  return (
    <input type="text" placeholder="search" className="searchBar"/>
  )
}

function bigSubmitButton() {
  return (
    <button className='bigSubmitButton'>submit</button>
  )
}


export default bigSubmitButton

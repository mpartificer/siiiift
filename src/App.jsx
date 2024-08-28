import { useState } from 'react'
import './App.css'
import daisyui from 'daisyui'
import { House } from 'lucide-react'
import { Search } from 'lucide-react'
import { Plus } from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { User } from 'lucide-react'




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

function footer() {
  return(
    <>
      <div className="btn footer">
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

export default footer

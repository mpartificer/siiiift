import { useState } from 'react'
import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { RouterProvider, useNavigate } from "react-router-dom"
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
import { router } from './Routes.jsx'
import { Header } from './components/multipurpose/Header.jsx'





function PostReactionBox() {
  return (
    <div className='postReactionBox'>
      <Heart size={40} color='#192F01'/>
      <MessageCircle size={40} color='#192F01'/>
      <History size={40} color='#192F01'/>
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

function App() {
  return (
    <div>
      <RouterProvider router={router}>
        <SignUpView />
      </RouterProvider>
    </div>
  );
}

export default App;

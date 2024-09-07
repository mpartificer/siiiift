import { useState } from 'react'
import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { RouterProvider, useNavigate } from "react-router-dom"
import { router } from './Routes.jsx'


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

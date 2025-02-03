import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { RouterProvider } from "react-router-dom"
import router from './Routes.jsx'
import SignUpView from './components/SignUpView.jsx'
import { AuthProvider } from './AuthContext.jsx'
import ToastManager from './components/multipurpose/ToastManager';




function App() {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router}>
          <ToastManager />
          <SignUpView />
        </RouterProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { RouterProvider } from "react-router-dom"
import router from './Routes.jsx'
import { AuthProvider } from './AuthContext.jsx'
import ToastManager from './components/multipurpose/ToastManager';




function App() {
  return (
      <AuthProvider>
      <ToastManager />
        <RouterProvider router={router}>
        </RouterProvider>
      </AuthProvider>
  );
}

export default App;

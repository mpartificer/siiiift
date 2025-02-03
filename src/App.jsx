import './index.css'
import './App.css';
import '../style.css';
import React from 'react'
import { RouterProvider } from "react-router-dom"
import router from './Routes.jsx'
import { AuthProvider } from './AuthContext.jsx'
import ToastManager from './components/multipurpose/ToastManager';




function App() {
  useEffect(() => {
    const handleToastNavigation = (event) => {
      const path = event.detail.path;
      router.navigate(path);
    };

    window.addEventListener('toast-navigation', handleToastNavigation);
    return () => window.removeEventListener('toast-navigation', handleToastNavigation);
  }, []);
  return (
      <AuthProvider>
      <ToastManager />
        <RouterProvider router={router}>
        </RouterProvider>
      </AuthProvider>
  );
}

export default App;

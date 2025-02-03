import React, { useEffect, useState } from 'react';
import Toast from './Toast.jsx';

// Create a custom event for toast updates
const TOAST_UPDATE_EVENT = 'TOAST_UPDATE';

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Function to handle toast events
    const handleToastUpdate = (event) => {
      const storedToasts = JSON.parse(localStorage.getItem('toasts') || '[]');
      setToasts(storedToasts);
    };

    // Listen for custom toast events
    window.addEventListener(TOAST_UPDATE_EVENT, handleToastUpdate);
    
    // Check for existing toasts on mount
    handleToastUpdate();

    return () => window.removeEventListener(TOAST_UPDATE_EVENT, handleToastUpdate);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('toasts', JSON.stringify(updated));
      return updated;
    });
  };

  // Remove fixed positioning from Toast component since container handles it
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          link={toast.link}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Helper function to add toasts from anywhere
export const addGlobalToast = (toast) => {
  const id = Date.now();
  const storedToasts = JSON.parse(localStorage.getItem('toasts') || '[]');
  const updatedToasts = [...storedToasts, { ...toast, id }];
  localStorage.setItem('toasts', JSON.stringify(updatedToasts));
  
  // Dispatch custom event to notify ToastManager
  window.dispatchEvent(new Event(TOAST_UPDATE_EVENT));
};

export default ToastManager;
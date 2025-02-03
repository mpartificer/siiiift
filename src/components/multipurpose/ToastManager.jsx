import React, { useEffect, useState } from 'react';
import Toast from './Toast';  // Import your existing Toast component

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Function to handle toast events from localStorage
    const handleStorageChange = () => {
      const storedToasts = JSON.parse(localStorage.getItem('toasts') || '[]');
      setToasts(storedToasts);
    };

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    // Check for existing toasts on mount
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('toasts', JSON.stringify(updated));
      return updated;
    });
  };

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
  
  // Dispatch storage event to notify ToastManager
  window.dispatchEvent(new Event('storage'));
};

export default ToastManager;
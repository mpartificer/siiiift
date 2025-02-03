import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const Toast = ({ message, type, link, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
  
    const handleLinkClick = (e) => {
      e.preventDefault();
      if (link) {
        const navigationEvent = new CustomEvent('toast-navigation', {
          detail: { path: link }
        });
        window.dispatchEvent(navigationEvent);
      }
    };
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    const baseClasses = "p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 max-w-md";
    const typeClasses = {
      success: "bg-green-100 text-green-800",
      loading: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800"
    };
  
    return (
      <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{message}</span>
        {link && type === 'success' && (
          <button onClick={handleLinkClick} className="underline font-medium">
            View Details
          </button>
        )}
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

export default Toast;
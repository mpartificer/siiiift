import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const Toast = ({ message, type, link, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    const baseClasses = "p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 max-w-md";
    const typeClasses = {
      success: "bg-secondary text-primary",
      loading: "bg-secondary text-primary",
      error: "bg-secondary text-primary"
    };
  
    // Construct the full URL with the correct base path
    const getFullUrl = (path) => {
      const baseUrl = 'https://mpartificer.github.io/siiiift/#';
      return `${baseUrl}${path}`;
    };
  
    return (
      <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{message}</span>
        {link && type === 'success' && (
          <a href={getFullUrl(link)} className="underline font-medium">
            view details
          </a>
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
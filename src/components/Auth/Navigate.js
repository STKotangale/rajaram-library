// CustomRouter.js
import React from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';

const CustomRouter = ({ children }) => {
  const handleNavigation = (event) => {
    // Prevent route changes triggered by manual URL input
    event.preventDefault();
    return <Navigate to="/" />;
  };

  React.useEffect(() => {
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  return <BrowserRouter>{children}</BrowserRouter>;
};

export default CustomRouter;

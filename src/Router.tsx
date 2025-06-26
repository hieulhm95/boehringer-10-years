import React, { useState, useEffect } from 'react';
import App from './App';
import LivePage from './components/LivePage';

const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route components
  const renderRoute = () => {
    switch (currentPath) {
      case '/live':
        return <LivePage />;
      case '/':
      default:
        return <App />;
    }
  };

  return <div>{renderRoute()}</div>;
};

export default Router;

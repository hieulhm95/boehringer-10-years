import React, { useState, useEffect } from 'react';
import App from './App';
import LivePage from './components/LivePage';
import Map from './Map';
import Controller from './Controller';
import FullMap from './Full';

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
      case '/control':
        return <Controller />;
      case '/map':
        return <Map />;
      case '/full':
        return <FullMap />;
      case '/':
      default:
        return <App />;
    }
  };

  return <div>{renderRoute()}</div>;
};

export default Router;

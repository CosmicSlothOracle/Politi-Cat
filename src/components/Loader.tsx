import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-inner"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
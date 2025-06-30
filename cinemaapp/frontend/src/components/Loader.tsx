import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className={`${sizeClasses[size]} rounded-full border-cinema-gold border-t-transparent animate-spin`}
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default Loader;
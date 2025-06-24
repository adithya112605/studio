"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: { width: '150px', height: '150px' },
    md: { width: '250px', height: '250px' },
    lg: { width: '350px', height: '350px' },
  };

  return (
    <dotlottie-player
      src="https://lottie.host/e434193b-18a7-47c3-827c-39659a685f09/6kS4BTuE8w.json"
      background="transparent"
      speed="1"
      style={sizeMap[size]}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default LoadingSpinner;

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
      src="https://lottie.host/a326c192-34b8-4993-8356-3243a753c156/6b79Ie171V.json"
      background="transparent"
      speed="1"
      style={sizeMap[size]}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default LoadingSpinner;

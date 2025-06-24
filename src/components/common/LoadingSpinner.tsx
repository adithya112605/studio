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
      src="https://lottie.host/588824f7-7275-4c31-a049-74a584959445/yF5oL10QfL.json"
      background="transparent"
      speed="1"
      style={sizeMap[size]}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default LoadingSpinner;

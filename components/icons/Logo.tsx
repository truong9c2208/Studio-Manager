import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <svg className={className} viewBox="0 0 300 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 42C14.5066 42 6 33.4934 6 23C6 12.5066 14.5066 4 25 4C35.4934 4 44 12.5066 44 23C44 33.4934 35.4934 42 25 42Z" stroke="#4F46E5" strokeWidth="8"/>
    <path d="M41 23C41 31.8366 33.8366 39 25 39C16.1634 39 9 31.8366 9 23C9 14.1634 16.1634 7 25 7" stroke="#4F46E5" strokeWidth="2"/>
    <path d="M25 7C33.8366 7 41 14.1634 41 23" stroke="#4338CA" strokeWidth="2"/>
    <text x="55" y="34" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="bold" fill="currentColor" color="#FFFFFF">MTP Studio</text>
  </svg>
);

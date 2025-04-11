
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          WeatherWise © 2025 | Developed by Eluru Poojith Kumar Reddy
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
          <a 
            href="https://linkedin.com/in/product-manager-accelerator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            The Product Manager Accelerator LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

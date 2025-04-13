import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedGoogleButton = ({ buttonText = "Continue with Google" }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle button click
  const handleClick = () => {
    setIsLoading(true);
    // Simulate authentication delay (replace with actual auth logic)
    setTimeout(() => {
      setIsLoading(false);
      // Navigate or perform additional actions here
    }, 2000);
  };

  // Google Logo SVG Component
  const GoogleLogo = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="18" 
      height="18"
      className="relative z-10"
    >
      <path 
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
        fill="#4285F4" 
      />
      <path 
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
        fill="#34A853" 
      />
      <path 
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
        fill="#FBBC05" 
      />
      <path 
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
        fill="#EA4335" 
      />
    </svg>
  );

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="flex justify-center w-full">
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glass Morphism Card Effect - Added for mobile appeal */}
        <div className="relative group">
          {/* Animated Background Gradient */}
          <motion.div 
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-60 blur-lg transition duration-1000"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Main Button */}
          <motion.button
            disabled={isLoading}
            onClick={handleClick}
            className={`relative flex items-center justify-center w-full py-3.5 px-6 sm:py-4 sm:px-8 rounded-xl overflow-hidden transition-all duration-300 
                      ${isLoading 
                        ? 'bg-gray-800 text-gray-300 border border-gray-700'
                        : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700/30 group-hover:border-indigo-500/20'
                      }`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {/* Left Glass Panel */}
            <span className="absolute left-0 top-0 h-full w-12 bg-white/5 backdrop-blur-sm" />
            
            {/* Google Logo or Loading Spinner */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-3 sm:left-5 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/30 backdrop-blur-sm"
                >
                  <LoadingSpinner />
                </motion.div>
              ) : (
                <motion.div
                  key="google"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-3 sm:left-5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <GoogleLogo />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Animated Border Effect */}
            {!isLoading && (
              <>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-700" />
                <span className="absolute top-0 right-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-700" />
              </>
            )}
            
            {/* Text Content */}
            <span className="relative ml-8 sm:ml-10 z-10 flex items-center font-medium text-sm sm:text-base">
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  Authenticating...
                </motion.span>
              ) : (
                <>
                  {buttonText}
                  
                  {/* Arrow that appears on hover */}
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-0 w-0 opacity-0 group-hover:opacity-100 group-hover:h-4 group-hover:w-4 ml-0 group-hover:ml-2 transition-all duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </>
              )}
            </span>
            
            {/* Loading Progress Bar */}
            {isLoading && (
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        </div>
        
        {/* Bottom Reflection */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-0.5 opacity-50" />
      </motion.div>
    </div>
  );
};

export default EnhancedGoogleButton;
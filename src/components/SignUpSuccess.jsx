import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import CreativeNLogo from '../components/NLogo';

const SignupSuccessPage = () => {
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  // Particles for background (matching LoginPage)
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));
  
  // Handle redirection countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        setRedirecting(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);
  
  // Redirect to home page
  useEffect(() => {
    if (redirecting) {
      // In a real app, you would use your router's navigation
      // This is a simple example
      const redirectTimer = setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [redirecting]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } }
  };
  
  // Check animation variants
  const circleVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };
  
  const checkVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative flex flex-col items-center justify-center">
      {/* Dynamic Background - same as LoginPage */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-purple-500 opacity-15"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Gradient overlays */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-1/3 h-1/3 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-blue-600/15 blur-[100px] rounded-full" />
      </div>
      
      {/* Success Container */}
      <AnimatePresence>
        {!redirecting && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 p-8 max-w-md w-full mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Logo */}
                <motion.div 
                  variants={itemVariants} 
                  className="mb-8"
                >
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                    <CreativeNLogo size="md" />
                  </div>
                </motion.div>
                
                {/* Check Mark Animation */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-8 relative"
                >
                  <div className="w-24 h-24 relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                      variants={circleVariants}
                    />
                    
                    <svg
                      className="absolute inset-0"
                      viewBox="0 0 50 50"
                      width="100%"
                      height="100%"
                    >
                      <motion.path
                        d="M14,27 L22,35 L36,15"
                        fill="transparent"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={checkVariants}
                      />
                    </svg>
                  </div>
                </motion.div>
                
                {/* Success Text */}
                <motion.h1 
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Sign Up Successful! 🎉
                  </span>
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants} 
                  className="text-lg text-gray-300 mb-8"
                >
                  Your NovaPay account has been created. Get ready to manage your finances mindfully.
                </motion.p>
                
                {/* Redirect Notification */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col items-center w-full mb-6"
                >
                  <p className="text-gray-300 mb-2">Redirecting to homepage in <span className="text-purple-400 font-bold">{countdown}</span> seconds</p>
                  <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full"
                      initial={{ width: "100%" }}
                      animate={{ width: `${countdown / 3 * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </motion.div>
                
                {/* Go to Home Button */}
                <motion.div variants={itemVariants} className="w-full">
                  <Link to="/">
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center"
                    >
                      Go to Home <ArrowRight className="ml-2" size={20} />
                    </motion.button>
                  </Link>
                </motion.div>
                
                {/* Footer Note */}
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-400 text-sm mt-8"
                >
                  NovaPay — Your personal space for smart, mindful money tracking.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupSuccessPage;
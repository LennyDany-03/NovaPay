import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreativeNLogo from '../components/NLogo';
import EnhancedGoogleButton from '../components/GoogleButton';

const SignUpPage = () => {
  // Animation controls
  const controls = useAnimation();

  // Particles for background (same as HomePage)
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));

  // Start animations when page loads
  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  // Animation variants (similar to HomePage)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative flex flex-col items-center justify-center">
      {/* Dynamic Background - same as HomePage */}
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
      
      {/* Back Button - Fixed position at top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-6 left-6 z-20"
      >
        <Link 
          to="/" 
          className="flex items-center text-white/80 hover:text-white transition-colors group"
        >
          <div className="bg-gray-800/50 backdrop-blur-md p-2 rounded-full border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300">
            <ArrowLeft size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">Back to Home</span>
        </Link>
      </motion.div>
      
      {/* Sign Up Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative z-10 p-8 max-w-md w-full mx-auto"
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo with fixed stable size */}
            <motion.div 
              variants={itemVariants} 
              className="mb-10 w-32 h-32 flex items-center justify-center"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                <CreativeNLogo size="lg" />
              </div>
            </motion.div>
            
            {/* Welcome Text */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Create your NovaPay Account 👋
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg text-gray-300 mb-8"
            >
              Your journey to smarter spending starts here.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center w-full mb-8"
            >
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 text-purple-400 mr-2" />
                <p className="text-gray-300">Sign up securely to get started:</p>
              </div>
            </motion.div>
            
            {/* Modern Google Button Component */}
            <motion.div variants={itemVariants} className="w-full mb-8">
              <EnhancedGoogleButton buttonText="Sign Up with Google" />
            </motion.div>
            
            {/* Already have an account link */}
            <motion.div
              variants={itemVariants}
              className="w-full text-center"
            >
              <p className="text-gray-400 text-sm">
                Already have an account? 👉{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
            
            {/* Footer Note */}
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-sm mt-8"
            >
              This app is private and secure. Your data stays with you. <br />
              No passwords. Just Google.
            </motion.p>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator - same animation as HomePage */}
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-purple-400" size={32} />
      </motion.div>
    </div>
  );
};

export default SignUpPage;
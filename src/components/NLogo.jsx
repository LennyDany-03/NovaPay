import React from 'react';
import { motion } from 'framer-motion';

const CreativeNLogo = ({ size = 'md' }) => {
  // Size classes
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0.4, 0.7, 0.4], 
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const floatingCircleVariants = {
    animate: i => ({
      y: [0, i % 2 === 0 ? -8 : -10, 0],
      x: [0, i % 2 === 0 ? 5 : -5, 0],
      transition: {
        duration: 2 + i,
        repeat: Infinity,
        repeatType: "reverse"
      }
    })
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} mx-auto`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-purple-700/40 to-indigo-600/40 rounded-xl blur-xl"
        variants={glowVariants}
      />

      {/* Main container */}
      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl overflow-hidden shadow-lg">
        {/* Decorative elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={floatingCircleVariants}
            animate="animate"
            className={`absolute w-${3 + i} h-${3 + i} rounded-full bg-white/20 blur-sm`}
            style={{
              top: `${15 + i * 20}%`,
              left: `${15 + i * 25}%`,
            }}
          />
        ))}

        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />

        {/* Creative N Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 100 100" 
            className="w-3/4 h-3/4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Background circuit-like patterns */}
            <motion.path
              d="M20,80 L20,30 C20,25 25,20 30,20 L70,20 C75,20 80,25 80,30 L80,80"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />
            
            <motion.path
              d="M30,70 L30,40 C30,35 35,30 40,30 L60,30 C65,30 70,35 70,40 L70,70"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
              variants={pathVariants}
            />

            {/* The actual N letter */}
            <motion.path
              d="M35,75 L35,35 L65,65 L65,25"
              stroke="white"
              strokeWidth="6"
              fill="none"
              variants={pathVariants}
            />
            
            {/* Accent dots */}
            <motion.circle
              cx="35"
              cy="25"
              r="4"
              fill="#A855F7"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { delay: 1.2, duration: 0.4 }
              }}
            />
            
            <motion.circle
              cx="65"
              cy="75"
              r="4"
              fill="#818CF8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { delay: 1.4, duration: 0.4 }
              }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default CreativeNLogo;
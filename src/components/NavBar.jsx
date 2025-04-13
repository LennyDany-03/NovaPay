import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  PieChart, 
  Settings, 
  User,
  QrCode
} from 'lucide-react';

const BottomNavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position to change desktop navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const bottomNavVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.1 }
  };

  // Nav links with Scan and Pay in the middle
  const navLinks = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Wallet', icon: <Wallet size={20} /> },
    { name: 'Scan', icon: <QrCode size={24} />, isSpecial: true },
    { name: 'Analytics', icon: <PieChart size={20} /> },
    { name: 'Profile', icon: <User size={20} /> }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled ? 'bg-gray-800/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        } transition-all duration-300 hidden md:block`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    N
                  </motion.div>
                </div>
                <div className="hidden sm:flex items-baseline">
                  <span className="text-xl font-extrabold text-white">Nova</span>
                  <span className="text-xl font-medium text-purple-400">Pay</span>
                </div>
              </motion.div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.filter(link => !link.isSpecial).map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeIndex === index 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/10'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={`mr-1.5`}>{link.icon}</span>
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Scan and Pay Button */}
            <div className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <QrCode size={16} />
                <span>Scan and Pay</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={bottomNavVariants}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-md border-t border-purple-700/30 md:hidden"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.map((link, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              initial="inactive"
              animate={activeIndex === index ? "active" : "inactive"}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                activeIndex === index
                ? 'text-purple-400'
                : 'text-gray-400'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {link.isSpecial ? (
                <div className="relative -mt-8">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.icon}
                  </motion.div>
                </div>
              ) : (
                <>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute top-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-b-full"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  <div className="relative">
                    {link.icon}
                    {activeIndex === index && (
                      <motion.div
                        className="absolute inset-0 bg-purple-400/20 rounded-full -z-10"
                        layoutId="iconBackground"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                  </div>
                </>
              )}
              <span className={`text-xs mt-1 font-medium ${link.isSpecial ? 'mt-2' : ''}`}>{link.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default BottomNavBar;
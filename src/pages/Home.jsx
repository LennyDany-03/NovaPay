import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  ChevronDown 
} from 'lucide-react';
import BottomNavBar from '../components/NavBar';
import CreativeNLogo from '../components/NLogo';

const HomePage = () => {
  // Refs and animation controls
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);
  
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 });
  const footerInView = useInView(footerRef, { once: false, amount: 0.5 });
  
  const aboutControls = useAnimation();
  const featuresControls = useAnimation();
  const footerControls = useAnimation();
  
  // Particles for background
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));
  
  // Start animations when elements come into view
  useEffect(() => {
    if (aboutInView) aboutControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
    if (footerInView) footerControls.start('visible');
  }, [aboutInView, featuresInView, footerInView, aboutControls, featuresControls, footerControls]);
  
  // Smooth scroll function
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  
  // Animation variants
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
  
  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 }
    })
  };

  // Features data
  const features = [
    {
      icon: <Wallet className="h-10 w-10 text-purple-400" />,
      title: "Track Payments",
      description: "Easily log and categorize all your UPI transactions in one secure place."
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-purple-400" />,
      title: "Control Spending",
      description: "Visualize spending patterns and set flexible budgets that work for you."
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-400" />,
      title: "Private & Secure",
      description: "Your financial data stays private and protected on your device."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative pb-16 md:pb-0">
      {/* Dynamic Background */}
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
      
      {/* Navbar */}
      <BottomNavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 min-h-screen flex flex-col items-center justify-center p-6 z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Creative Logo */}
          <motion.div variants={itemVariants} className="mb-12 relative">
            <CreativeNLogo size="md" />
          </motion.div>
          
          {/* Welcome Message */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Welcome, Lenny 👋
            </span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Your personal space to track UPI payments, control spending, and stay financially mindful — effortlessly.
          </motion.p>
          
          {/* Call to action */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-16"
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2" size={20} />
            </motion.button>
            
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(168, 85, 247, 0.15)" 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToAbout}
              className="bg-purple-600/10 text-purple-300 border border-purple-500/30 px-8 py-4 rounded-xl font-bold text-lg"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
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
      </section>
      
      {/* About Section */}
      <section ref={aboutRef} className="relative py-20 px-6 z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={aboutControls}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-10 text-center"
          >
            <span className="bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
              About NovaPay
            </span>
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700 mb-12 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />
            
            <p className="text-gray-200 leading-relaxed text-lg md:text-xl relative z-10">
              NovaPay is your private budget companion. It helps you log and reflect on your UPI transactions — amount and purpose — so you always know where your money goes. Designed just for you, NovaPay makes tracking simple, calm, and meaningful. No noise. No clutter. Just your spending, your way.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-8 mx-auto" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="relative py-20 px-6 z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={featuresControls}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
          >
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Why Choose NovaPay
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={featureCardVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-purple-600 to-indigo-600 w-full"></div>
                <div className="p-8 flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className="mb-6 p-4 bg-purple-900/30 rounded-xl"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="mt-16 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-purple-900/40 to-gray-800 p-6 rounded-xl border border-purple-800/30 max-w-3xl"
            >
              <div className="flex items-start mb-4">
                <Sparkles className="text-purple-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <p className="text-lg text-gray-300">
                  "NovaPay has completely changed how I view my spending. The simple interface makes it so easy to track where my money goes."
                </p>
              </div>
              <div className="flex justify-end">
                <p className="text-purple-300 font-medium">- Happy User</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer CTA */}
      <section ref={footerRef} className="relative py-20 px-6 z-10 mb-16 md:mb-0">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={footerControls}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-900/40 to-gray-900 rounded-2xl p-10 border border-purple-900/20 shadow-xl shadow-purple-900/5">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
              Ready to take control?
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8">
              Start your mindful money journey today 🚀
            </motion.p>
            
            <motion.button 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center mx-auto"
            >
              Get Started <CheckCircle className="ml-2" size={20} />
            </motion.button>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-gray-500 mt-10">
            © 2025 NovaPay. All rights reserved.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
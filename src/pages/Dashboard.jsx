"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import {
  Smile,
  ChevronDown,
  Wallet,
  Settings,
  Bell,
  LogOut,
  ArrowRight,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  ChevronRight,
  Moon,
  Sun,
  Star,
  Award,
  Sparkles,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { supabase } from "../supabase"

const WelcomePage = () => {
  const navigate = useNavigate()
  const controls = useAnimation()
  const scrollRef = useRef(null)
  
  // User state
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState(null)
  const [timeOfDay, setTimeOfDay] = useState('')
  const [currentTip, setCurrentTip] = useState(0)
  const [showParticles, setShowParticles] = useState(true)

  // Financial tips
  const financialTips = [
    "Set aside 20% of income for savings and investments",
    "Track your daily expenses to identify spending patterns",
    "Create an emergency fund covering 3-6 months of expenses",
    "Review and adjust your budget regularly to stay on track"
  ]

  // Determine time of day for personalized greeting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
    
    // Rotate tips
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % financialTips.length)
    }, 5000)
    
    return () => clearInterval(tipInterval)
  }, [])

  // Fetch user data on component mount
  useEffect(() => {
    // Start animations
    controls.start("visible")
    
    // Check for user authentication and fetch user data
    const fetchUserData = async () => {
      try {
        // Get current session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !sessionData.session) {
          console.error("Authentication error:", sessionError)
          navigate("/login")
          return
        }
        
        const { user: authUser } = sessionData.session
        
        // Fetch user data from your User table
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("*")
          .eq("id", authUser.id)
          .single()
        
        if (userError) {
          console.error("User data fetch error:", userError)
          
          // If we can't find user data, at least use the auth data
          // Extract first name from email if no name provided
          const emailFirstName = authUser.email.split('@')[0]
          // Capitalize first letter and make the rest lowercase
          const formattedFirstName = emailFirstName.charAt(0).toUpperCase() + emailFirstName.slice(1).toLowerCase()
          
          setUser({
            id: authUser.id,
            name: authUser.user_metadata?.full_name || formattedFirstName,
            email: authUser.email,
            photoUrl: authUser.user_metadata?.avatar_url || null,
            joinDate: new Date(authUser.created_at).toISOString().split('T')[0]
          })
        } else {
          // If user exists in DB, use that data
          setUser({
            id: userData.id,
            name: userData.name || authUser.user_metadata?.full_name || authUser.email.split('@')[0],
            email: userData.email || authUser.email,
            photoUrl: userData.avatar_url || authUser.user_metadata?.avatar_url || null,
            joinDate: userData.created_at
          })
        }
        
        // Simulate loading for smoother animation
        setTimeout(() => setLoading(false), 700)
      } catch (error) {
        console.error("Auth error:", error)
        navigate("/login")
      }
    }
    
    fetchUserData()
  }, [controls, navigate])

  // Get first name for greeting
  const getFirstName = () => {
    if (!user || !user.name) return ''
    
    // If name contains spaces, return first part
    if (user.name.includes(' ')) {
      return user.name.split(' ')[0]
    }
    
    return user.name
  }

  // Calculate user stats
  const userStats = {
    daysActive: user ? Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24)) : 0,
    transactionCount: 0,
    nextFeature: "Smart Budgeting"
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 10,
        mass: 0.5,
      } 
    },
  }

  const popVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      } 
    },
  }

  // Animated background particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 1,
    duration: Math.random() * 40 + 15,
    delay: Math.random() * 2,
    opacityBase: Math.random() * 0.2 + 0.1,
  }))

  // Interactive quick actions
  const quickActions = [
    {
      id: 1,
      title: "Add First Transaction",
      description: "Start tracking your expenses",
      icon: <CreditCard className="h-7 w-7 text-purple-300" />,
      color: "bg-purple-500/30",
      hoverColor: "hover:bg-purple-500/40",
      borderColor: "border-purple-500/30",
      action: () => navigate("/dashboard")
    },
    {
      id: 2,
      title: "Complete Profile",
      description: "Add your financial goals",
      icon: <Users className="h-7 w-7 text-blue-300" />,
      color: "bg-blue-500/30",
      hoverColor: "hover:bg-blue-500/40",
      borderColor: "border-blue-500/30",
      action: () => navigate("/profile")
    },
    {
      id: 3,
      title: "Set Budget Limits",
      description: "Plan your monthly spending",
      icon: <TrendingUp className="h-7 w-7 text-green-300" />,
      color: "bg-green-500/30",
      hoverColor: "hover:bg-green-500/40",
      borderColor: "border-green-500/30",
      action: () => navigate("/budget")
    }
  ]

  // Dashboard features for preview section
  const dashboardFeatures = [
    {
      icon: <CreditCard />,
      title: "Track Expenses",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      description: "Log and categorize all your spending"
    },
    {
      icon: <TrendingUp />,
      title: "View Analytics",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      description: "See spending patterns and insights"
    },
    {
      icon: <Bell />,
      title: "Set Reminders",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      description: "Never miss a payment date"
    },
    {
      icon: <Settings />,
      title: "Customize App",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      description: "Tailor the experience to your needs"
    }
  ]

  // Scroll handler for scroll animations
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollY = window.scrollY
      const winHeight = window.innerHeight
      const docHeight = document.body.scrollHeight
      const totalScrollable = docHeight - winHeight
      const scrollPercentage = (scrollY / totalScrollable) * 100
      
      // Toggle particles based on scroll position
      if (scrollPercentage > 70) {
        setShowParticles(false)
      } else {
        setShowParticles(true)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Loading screen with animated logo
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut"
          }}
          className="flex items-center mb-8"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-md z-0"
            />
          </div>
          <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            NovaPay
          </h1>
        </motion.div>
        
        <div className="relative w-24 h-8 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          />
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-purple-300 text-sm font-medium"
        >
          Preparing your personalized experience...
        </motion.p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        {/* Animated Particles */}
        <AnimatePresence>
          {showParticles && particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: particle.opacityBase,
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.5 },
                x: { 
                  duration: particle.duration, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut",
                  delay: particle.delay 
                },
                y: { 
                  duration: particle.duration * 0.8, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut",
                  delay: particle.delay + 1
                }
              }}
              className="absolute rounded-full bg-white"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                boxShadow: particle.size > 3 ? `0 0 ${particle.size * 2}px rgba(167, 139, 250, 0.5)` : 'none'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Dynamic gradient overlays */}
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/3 w-1/3 h-1/3 bg-indigo-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4
          }}
          className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-blue-600/15 blur-[100px] rounded-full" 
        />
      </div>

      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 pt-32 pb-32"
      >
        {/* Welcome Header Section */}
        <motion.div 
          variants={itemVariants} 
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center mb-3"
              >
                <div className="h-8 w-8 rounded-full mr-3 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
                  {timeOfDay === 'morning' && <Sun className="h-4 w-4 text-white" />}
                  {timeOfDay === 'afternoon' && <Sun className="h-4 w-4 text-white" />}
                  {timeOfDay === 'evening' && <Moon className="h-4 w-4 text-white" />}
                </div>
                <p className="text-purple-300 font-medium">Good {timeOfDay}!</p>
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold mb-2 flex flex-wrap items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3, 
                  type: "spring",
                  stiffness: 100
                }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mr-3">
                  Welcome, {getFirstName()}
                </span>
                <motion.span
                  animate={{ 
                    rotate: [0, 15, 0, -15, 0],
                    scale: [1, 1.2, 1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: 1.5,
                    repeat: 1
                  }}
                >
                  👋
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-400 text-lg max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                We're excited to help you take control of your finances with our powerful tracking tools
              </motion.p>
            </div>
            
            {/* User Profile */}
            <motion.div 
              className="mt-6 md:mt-0 flex items-center"
              variants={popVariants}
            >
              <div className="flex flex-col items-end mr-4">
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 w-14 rounded-full overflow-hidden border-2 border-purple-500 cursor-pointer relative"
                >
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {getFirstName().charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <Settings className="text-white/80 h-6 w-6" />
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-gray-900"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0.7)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Financial Tip Banner */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden shadow-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-500/30 p-2 rounded-lg mr-4 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-300 text-sm"
                >
                  <span className="font-medium text-purple-300">Pro Tip: </span>
                  {financialTips[currentTip]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message Card */}
        <motion.div 
          variants={itemVariants}
          className="mb-12 overflow-hidden"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden shadow-lg relative"
          >
            {/* Decorative elements */}
            <motion.div 
              animate={{ 
                x: [0, 20, 0],
                y: [0, -20, 0],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-xl -mr-10 -mt-10" 
            />
            <motion.div 
              animate={{ 
                x: [0, -20, 0],
                y: [0, 20, 0],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 18, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-xl -ml-10 -mb-10" 
            />
            
            <div className="p-8 relative z-10">
              <div className="flex items-start mb-6">
                <motion.div 
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" 
                  }}
                  className="bg-gradient-to-br from-purple-500/40 to-indigo-500/40 p-4 rounded-lg mr-6 shadow-lg"
                >
                  <Smile className="h-8 w-8 text-purple-200" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">
                    Your Financial Journey Starts Here!
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Welcome to NovaPay – your personal finance assistant. We've prepared a customized experience to help you track, manage, and optimize your finances. Let's make your money work smarter for you!
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <motion.div 
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" 
                  }}
                  className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 rounded-lg p-5 border border-blue-500/20"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
                      <Calendar className="h-5 w-5 text-blue-300" />
                    </div>
                    <p className="text-gray-300 font-medium">Account Age</p>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-white mr-2">{userStats.daysActive}</p>
                    <p className="text-blue-300">days</p>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(userStats.daysActive * 2, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)" 
                  }}
                  className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 rounded-lg p-5 border border-purple-500/20"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
                      <CreditCard className="h-5 w-5 text-purple-300" />
                    </div>
                    <p className="text-gray-300 font-medium">Transactions</p>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-white mr-2">{userStats.transactionCount}</p>
                    <p className="text-purple-300">total</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex-1">
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "30%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-purple-300 ml-2">Get started</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)" 
                  }}
                  className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 rounded-lg p-5 border border-green-500/20"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
                      <Star className="h-5 w-5 text-green-300" />
                    </div>
                    <p className="text-gray-300 font-medium">Coming Soon</p>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-xl font-bold text-white mr-2">{userStats.nextFeature}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [0.95, 1, 0.95]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="flex items-center bg-green-500/20 px-2 py-0.5 rounded text-xs text-green-300"
                    >
                      <span className="mr-1">Coming soon</span>
                      <ChevronRight size={12} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Get Started With These Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <motion.div 
                key={action.id}
                onClick={action.action}
                initial={{ opacity: 0.9 }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.3)",
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br from-gray-800/80 to-gray-900 rounded-xl border ${action.borderColor} p-6 shadow-lg cursor-pointer transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Animated hover effect */}
                <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`${action.color} ${action.hoverColor} p-3 rounded-lg shadow-lg transition-colors duration-300`}
                  >
                    {action.icon}
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="h-8 w-8 rounded-full bg-gray-800/80 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                
                {/* Animated progress indicator */}
                <div className="mt-4 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                    transition={{ duration: 1, delay: action.id * 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Dashboard Preview Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-400" />
                Ready for More?
              </h2>
              <p className="text-gray-400 max-w-lg">
                Dive into your full financial dashboard and unlock the complete NovaPay experience.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-5 md:mt-0"
            >
              <Link 
                to="/dashboard"
                className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Go to Dashboard
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            whileHover={{ 
              boxShadow: "0 20px 40px -20px rgba(124, 58, 237, 0.3)" 
            }}
            className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center justify-center py-6 relative z-10">
              <motion.div 
                whileHover={{ 
                  rotate: 360,
                  boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)"
                }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-br from-purple-500/30 to-indigo-600/30 p-5 rounded-full mb-5 backdrop-blur-sm"
              >
                <Wallet className="h-10 w-10 text-purple-300" />
              </motion.div>
              
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-3">Your complete financial dashboard awaits</h3>
              <p className="text-gray-400 text-base mb-8 text-center max-w-2xl">
                Track transactions, view spending patterns, set budgets, and take full control of your financial journey with our powerful and intuitive dashboard.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl mt-4">
                {dashboardFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.2)" 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 p-5 rounded-xl border border-gray-700/50 flex flex-col items-center text-center relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className={`${feature.bgColor} p-3 rounded-lg mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                      <motion.div 
                        className={feature.color}
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: index * 0.5
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-2 relative z-10">{feature.title}</h4>
                    <p className="text-sm text-gray-400 relative z-10">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Sign Out Section */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)"
          }}
        >
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-transparent" />
            
            <div className="flex items-center mb-4 sm:mb-0 relative z-10">
              <div className="bg-gray-800/70 p-2 rounded-lg mr-4">
                <LogOut className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Need to leave?</h4>
                <p className="text-gray-400 text-sm">You can safely sign out and return anytime.</p>
              </div>
            </div>
            
            <motion.button 
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 bg-gradient-to-r from-gray-800 to-gray-900 text-purple-400 hover:text-purple-300 transition-colors px-6 py-2.5 rounded-lg border border-purple-500/30 hover:border-purple-500/50 shadow-lg group"
            >
              <span className="relative z-10 flex items-center">
                Sign Out
                <LogOut className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ChevronDown className="text-purple-400" size={32} />
      </motion.div>
    </div>
  )
}

export default WelcomePage
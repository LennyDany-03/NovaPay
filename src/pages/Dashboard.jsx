"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
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
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { supabase } from "../supabase"

const WelcomePage = () => {
  const navigate = useNavigate()
  const controls = useAnimation()
  
  // User state
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
        
        setLoading(false)
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
    nextFeature: "Budget Setting"
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  // Particles for background (matching Login/Dashboard pages)
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
  }))

  // Quick actions for welcome cards
  const quickActions = [
    {
      id: 1,
      title: "Add First Transaction",
      description: "Start tracking your expenses",
      icon: <CreditCard className="h-6 w-6 text-purple-400" />,
      color: "bg-purple-500/20",
      action: () => navigate("/dashboard")
    },
    {
      id: 2,
      title: "Complete Profile",
      description: "Add your financial goals",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      color: "bg-blue-500/20",
      action: () => navigate("/profile")
    },
    {
      id: 3,
      title: "Set Budget Limits",
      description: "Plan your monthly spending",
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
      color: "bg-green-500/20",
      action: () => navigate("/budget")
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-purple-300">Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        {/* Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-purple-500 opacity-15"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-1/3 h-1/3 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-blue-600/15 blur-[100px] rounded-full" />
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
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  Welcome, {getFirstName()} 👋
                </span>
              </h1>
              <p className="text-gray-400 text-lg">We're excited to help you track your finances</p>
            </div>
            
            {/* User Profile */}
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="flex flex-col items-end mr-4">
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <div className="relative">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-500">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-purple-700 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {getFirstName().charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-gray-900"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message Card */}
        <motion.div 
          variants={itemVariants}
          className="mb-10 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl border border-purple-700/30 overflow-hidden shadow-lg"
        >
          <div className="p-8 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-600/20 rounded-full blur-xl -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <div className="flex items-start mb-6">
                <div className="bg-purple-500/30 p-3 rounded-lg mr-4">
                  <Smile className="h-8 w-8 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Let's get started with NovaPay!</h2>
                  <p className="text-gray-300">
                    Your financial journey begins here. We've prepared a personalized experience to help you track and manage your money effortlessly.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Age</p>
                    <p className="text-lg font-medium text-white">{userStats.daysActive} days</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Transactions</p>
                    <p className="text-lg font-medium text-white">{userStats.transactionCount}</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
                  <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Next Feature</p>
                    <p className="text-lg font-medium text-white">{userStats.nextFeature}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-purple-300">Get Started With These Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <div 
                key={action.id}
                onClick={action.action}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg cursor-pointer hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    {action.icon}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Dashboard Preview Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-purple-300">Ready for More?</h2>
            <Link 
              to="/dashboard"
              className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Your financial dashboard awaits</h3>
              <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                Track transactions, view spending patterns, and take control of your financial journey
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-6 w-6 text-purple-400 mb-2" />
                  <p className="text-sm text-gray-300">Track Expenses</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <TrendingUp className="h-6 w-6 text-blue-400 mb-2" />
                  <p className="text-sm text-gray-300">View Analytics</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <Bell className="h-6 w-6 text-green-400 mb-2" />
                  <p className="text-sm text-gray-300">Set Reminders</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <Settings className="h-6 w-6 text-yellow-400 mb-2" />
                  <p className="text-sm text-gray-300">Customize App</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Sign Out Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <LogOut className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-gray-300">Need to leave? You can safely sign out and return anytime.</p>
            </div>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors px-4 py-2 rounded-lg border border-purple-500/30 hover:border-purple-500/50"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
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
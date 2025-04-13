"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useAnimation } from "framer-motion"
import {
  LogOut,
  User,
  Plus,
  Search,
  Calendar,
  Download,
  AlertTriangle,
  X,
  Edit3,
  Save,
  ChevronDown,
  ChevronUp,
  Wallet,
  PieChart,
} from "lucide-react"
import { supabase, signOut, getCurrentUser } from "../supabase"
import BottomNavBar from "../components/NavBar"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dashboard state
  const [transactions, setTransactions] = useState([
    { id: 1, date: "Apr 14", amount: 480, message: "Subway Snacks" },
    { id: 2, date: "Apr 13", amount: 1800, message: "Grocery Shopping" },
    { id: 3, date: "Apr 12", amount: 300, message: "Uber Ride" },
    { id: 4, date: "Apr 10", amount: 2500, message: "Rent Payment" },
    { id: 5, date: "Apr 8", amount: 750, message: "Electricity Bill" },
    { id: 6, date: "Apr 7", amount: 1200, message: "Phone Bill" },
    { id: 7, date: "Apr 5", amount: 350, message: "Restaurant Dinner" },
    { id: 8, date: "Apr 3", amount: 2020, message: "Online Shopping" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [budgetLimit, setBudgetLimit] = useState(15000)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({ amount: "", message: "" })
  const [notes, setNotes] = useState("📝 Don't spend on Zomato next week!")
  const [editingNotes, setEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState("")
  const [showWeeklyView, setShowWeeklyView] = useState(true)

  const notesRef = useRef(null)
  const controls = useAnimation()

  // Particles for background (same as HomePage)
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
  }))

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the authenticated user
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          navigate("/login")
          return
        }

        setUser(currentUser)

        // Get user data from the User table
        const { data, error } = await supabase.from("User").select("*").eq("id", currentUser.id).single()

        if (error) throw error

        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
        controls.start("visible")
      }
    }

    checkAuth()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login")
      }
    })

    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [navigate, controls])

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  const handleAddTransaction = () => {
    if (!newTransaction.amount) return

    const amount = Number.parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    const today = new Date()
    const month = today.toLocaleString("default", { month: "short" })
    const day = today.getDate()

    const newEntry = {
      id: Date.now(),
      date: `${month} ${day}`,
      amount: amount,
      message: newTransaction.message || "Unlabeled Transaction",
    }

    setTransactions([newEntry, ...transactions])
    setNewTransaction({ amount: "", message: "" })
    setShowAddForm(false)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm),
  )

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const remaining = budgetLimit - totalSpent
  const percentSpent = (totalSpent / budgetLimit) * 100

  const weeklyData = [
    { day: "Mon", amount: 120 },
    { day: "Tue", amount: 0 },
    { day: "Wed", amount: 1800 },
    { day: "Thu", amount: 99 },
    { day: "Fri", amount: 450 },
    { day: "Sat", amount: 0 },
    { day: "Sun", amount: 300 },
  ]

  const startEditingNotes = () => {
    setTempNotes(notes)
    setEditingNotes(true)
    setTimeout(() => {
      notesRef.current?.focus()
    }, 100)
  }

  const saveNotes = () => {
    setNotes(tempNotes)
    setEditingNotes(false)
  }

  const cancelEditNotes = () => {
    setEditingNotes(false)
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Date", "Amount", "Message"]
    const csvContent = [headers.join(","), ...transactions.map((t) => `${t.date},${t.amount},"${t.message}"`)].join(
      "\n",
    )

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `novapay_transactions_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Animation variants (similar to HomePage)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative pb-24 md:pb-0">
      {/* Dynamic Background - same as HomePage */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        {/* Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-purple-500 opacity-10"
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
      <BottomNavBar />

      {/* Sign Out Button - Mobile (top right) */}
      <motion.button
        onClick={handleSignOut}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-50 md:hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full shadow-lg"
      >
        <LogOut size={20} />
      </motion.button>

      {/* Sign Out Button - Desktop (bottom right) */}
      <motion.button
        onClick={handleSignOut}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative pt-20 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="container mx-auto px-4 py-6"
        >
          {/* Header with user welcome */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            {/* User Profile Image */}
            <div className="flex justify-center mb-6">
              {user?.user_metadata?.avatar_url ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-sm opacity-70"></div>
                  <img
                    src={user.user_metadata.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-purple-500 relative z-10"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-sm opacity-70"></div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center relative z-10">
                    <User className="w-10 h-10" />
                  </div>
                </div>
              )}
            </div>

            {/* Welcome Message */}
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Welcome back, {userData?.name?.split(" ")[0] || "User"}! 👋
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Here's your spending overview and transaction log.
            </motion.p>
          </motion.div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            {/* Left column - Monthly spend and weekly overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Monthly Spend Overview */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />

                <h2 className="text-xl font-semibold mb-6 flex items-center relative z-10">
                  <Wallet className="w-6 h-6 mr-2 text-purple-400" />
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Monthly Spend Overview
                  </span>
                </h2>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Spend in April:</span>
                    <span className="text-xl font-bold text-white">₹{totalSpent.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Budget Limit:</span>
                    <span className="text-lg text-white">₹{budgetLimit.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Remaining:</span>
                    <span className={`text-lg font-medium ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
                      ₹{remaining.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentSpent, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2.5 rounded-full ${
                        percentSpent > 90
                          ? "bg-red-500"
                          : percentSpent > 75
                            ? "bg-yellow-500"
                            : "bg-gradient-to-r from-purple-500 to-indigo-500"
                      }`}
                    ></motion.div>
                  </div>

                  {percentSpent > 80 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg text-sm"
                    >
                      <AlertTriangle size={16} />
                      <span>You've used over 80% of your monthly budget!</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Week at a Glance */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h2 className="text-xl font-semibold flex items-center">
                    <PieChart className="w-6 h-6 mr-2 text-purple-400" />
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Week at a Glance
                    </span>
                  </h2>
                  <button onClick={() => setShowWeeklyView(!showWeeklyView)} className="text-gray-400 hover:text-white">
                    {showWeeklyView ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {showWeeklyView && (
                  <div className="grid grid-cols-7 gap-2 relative z-10">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm">{day.day}</span>
                        <div className="w-full bg-gray-700/50 rounded-lg mt-2 relative" style={{ height: "60px" }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.amount / 2000) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-purple-600 to-indigo-500"
                            style={{ maxHeight: "100%" }}
                          ></motion.div>
                        </div>
                        <span className={`text-xs mt-1 ${day.amount > 0 ? "text-white" : "text-gray-500"}`}>
                          {day.amount > 0 ? `₹${day.amount}` : "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Notes Section */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />

                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Edit3 className="w-6 h-6 mr-2 text-purple-400" />
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Notes
                    </span>
                  </h2>

                  {!editingNotes ? (
                    <button onClick={startEditingNotes} className="text-gray-400 hover:text-white">
                      <Edit3 size={16} />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={saveNotes} className="text-green-400 hover:text-green-300">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEditNotes} className="text-red-400 hover:text-red-300">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {!editingNotes ? (
                  <p className="text-gray-300 whitespace-pre-wrap relative z-10">{notes}</p>
                ) : (
                  <textarea
                    ref={notesRef}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-10"
                    placeholder="Add your notes here..."
                  />
                )}
              </motion.div>
            </div>

            {/* Right column - Transactions and add form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Transaction Form */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden relative"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Plus className="w-6 h-6 mr-2 text-purple-400" />
                      <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Add Transaction
                      </span>
                    </h2>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="text-gray-400 hover:text-white">
                      {showAddForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter amount"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Message (optional)</label>
                          <input
                            type="text"
                            value={newTransaction.message}
                            onChange={(e) => setNewTransaction({ ...newTransaction, message: e.target.value })}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="What's this for?"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddTransaction}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
                        >
                          Save Transaction
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Transaction List */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl overflow-hidden relative"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />

                <div className="p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Calendar className="w-6 h-6 mr-2 text-purple-400" />
                      <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Recent Transactions
                      </span>
                    </h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-initial">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full sm:w-64 bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Search transactions..."
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportToCSV}
                        className="bg-gray-700/50 hover:bg-gray-600/50 text-white p-2 rounded-lg transition-colors"
                        title="Export to CSV"
                      >
                        <Download size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Message</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction, index) => (
                            <motion.tr
                              key={transaction.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                              className="border-b border-gray-700/50 hover:bg-gray-800/30"
                            >
                              <td className="py-3 px-4 text-gray-300">{transaction.date}</td>
                              <td className="py-3 px-4 text-white">{transaction.message}</td>
                              <td className="py-3 px-4 text-right font-medium text-white">
                                ₹{transaction.amount.toLocaleString()}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="py-6 text-center text-gray-400">
                              {searchTerm ? "No transactions match your search" : "No transactions found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              {/* Export Data Button (Mobile Only) */}
              <motion.div variants={itemVariants} className="flex justify-center mt-6 md:hidden">
                <motion.button
                  onClick={exportToCSV}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                  <Download size={18} />
                  Export Transactions
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center text-gray-500 mt-8 mb-24 md:mb-8">
            <p>© 2025 NovaPay. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Nav Bar is already included at the top of the component */}
    </div>
  )
}

export default Dashboard

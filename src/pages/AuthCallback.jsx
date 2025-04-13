"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../supabase"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)

  // Determine if this was a login or signup attempt based on sessionStorage
  const authSource = sessionStorage.getItem("authSource") || "signup"
  const isLoginAttempt = authSource === "login"

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase will automatically handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        if (data.session) {
          const { user } = data.session

          // Check if user exists in User table
          const { data: existingUser, error: fetchError } = await supabase
            .from("User")
            .select("id")
            .eq("id", user.id)
            .single()

          if (fetchError) {
            // No user found in our database
            if (isLoginAttempt) {
              // This was a login attempt for a user that hasn't signed up
              console.log("Login attempt for non-existent user")
              navigate("/login-success", {
                state: {
                  error: true,
                  message: "Account not found. Please sign up first.",
                },
              })
              return
            } else {
              // This is a new user signing up - create their record
              console.log("Creating new user record for signup")
              const { error: insertError } = await supabase.from("User").insert([
                {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata.full_name || user.email.split("@")[0],
                  avatar_url: user.user_metadata.avatar_url || null,
                  created_at: new Date(),
                },
              ])

              if (insertError) {
                console.warn("Insert failed, relying on DB trigger instead:", insertError.message)
              }

              // Navigate to signup success
              navigate("/signup-success")
            }
          } else {
            // User exists in the database
            if (isLoginAttempt) {
              // This was a login attempt and user exists - go to login success
              console.log("Login successful for existing user")
              navigate("/login-success", { state: { error: false } })
            } else {
              // This was a signup attempt but user already exists
              console.log("Signup attempt for existing user")
              navigate("/login-success")
            }
          }
        } else {
          setError("Authentication failed. Please try again.")
          toast.error("Authentication failed. Please try again.")
          setTimeout(() => navigate(isLoginAttempt ? "/login" : "/signup"), 3000)
        }
      } catch (err) {
        console.error("Error during auth callback:", err.message)
        setError(err.message)
        toast.error(err.message)
        setTimeout(() => navigate(isLoginAttempt ? "/login" : "/signup"), 3000)
      }
    }

    handleAuthCallback()

    // Clear the auth source after handling
    return () => {
      sessionStorage.removeItem("authSource")
    }
  }, [navigate, isLoginAttempt])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl max-w-md w-full text-center">
        {error ? (
          <div className="space-y-4">
            <div className="text-red-400 text-xl font-semibold">Authentication Error</div>
            <p className="text-gray-300">{error}</p>
            <p className="text-gray-400 text-sm">Redirecting you back to {isLoginAttempt ? "login" : "sign up"}...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-pulse"></div>
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <svg
                    className="w-16 h-16 text-purple-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
            <h2 className="text-xl font-semibold">Completing Your {isLoginAttempt ? "Login" : "Sign Up"}</h2>
            <p className="text-gray-300">Just a moment while we authenticate your account...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallback

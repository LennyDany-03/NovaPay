import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { supabase, signOut, getCurrentUser } from '../supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the authenticated user
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        setUser(currentUser);
        
        // Get user data from the User table
        const { data, error } = await supabase
          .from('User')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (error) throw error;
        
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login');
        }
      }
    );
    
    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            NovaPay Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-purple-500"
              />
            )}
            
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center">
              <User className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome, {userData?.name || 'User'}!</h2>
              <p className="text-gray-400">{userData?.email}</p>
            </div>
          </div>
          
          <p className="text-gray-300 mt-4">
            You've successfully signed up and logged in with Google OAuth via Supabase!
          </p>
          
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-2">Your Profile Data:</h3>
            <pre className="text-xs text-gray-300 overflow-x-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Placeholder for dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample dashboard cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-purple-500/40 transition-colors"
            >
              <h3 className="text-lg font-medium mb-2">Feature {index + 1}</h3>
              <p className="text-gray-400">This is a placeholder for your NovaPay feature.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import SignUpSuccess from './components/SignUpSuccess'
import LoginSuccess from './components/LoginSuccess'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginsuccess" element={<LoginSuccess />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupsuccess" element={<SignUpSuccess />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

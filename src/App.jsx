import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import AuthCallback from "./pages/AuthCallback"
import Dashboard from "./pages/Dashboard"
import SignUpSuccess from "./components/SignUpSuccess"
import LoginSuccess from "./components/LoginSuccess"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

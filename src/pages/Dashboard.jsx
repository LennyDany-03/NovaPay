import React from 'react'
import NavBar from '../components/NavBar'
const Dashboard = () => {
  return (
    <>
    <NavBar/>
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>
      <p>This is where you can manage your account and settings.</p>     
    </div>
    </>
  )
}

export default Dashboard

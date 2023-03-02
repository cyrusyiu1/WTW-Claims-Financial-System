import React from 'react'
import Admin from '../components/Admin'
import Login from '../components/Login'
import Policy from '../components/Policy'
import Register from '../components/Register'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
  <div style={{marginLeft:'20%'}}>
    <Sidebar/>
      <h1>WTW Claims Financial System</h1>
      {/* <Register></Register>
      <Login></Login>
      <Admin></Admin>
      <Policy></Policy> */}
  </div>
  )
}

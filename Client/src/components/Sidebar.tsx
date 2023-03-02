import React, { Children } from 'react'
import { Link } from 'react-router-dom'
import style from '../style/sidebar.module.css'

export default function Sidebar() {
  return (
    <div className={style.sidebar} style={{width:'20%'}}>
      <div className={style.logo}>
        <h2>WTW Claims Financial System</h2>
      </div>
      <div className={style.menu}>
        <ul>
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"Register"}>Register</Link></li>
            <li><Link to={"Login"}>Login</Link></li>
            <li><Link to={"Admin"}>Admin</Link></li>
            <li><Link to={"Policy"}>Policy</Link></li>
            {/* <li><Link to={"PolicyList"}>PolicyList</Link></li> */}
        </ul>
      </div>
    </div>
  )
}

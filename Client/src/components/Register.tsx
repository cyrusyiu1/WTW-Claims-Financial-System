import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { env } from "../env";
import style from '../style/register.module.css'

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUsertype] = useState("")
    const [registerResult,setRegisterResult] = useState({type:"",message:""})

    const api_server = env.apiOrigin;

    const submitButton = (event: FormEvent) => {
        event.preventDefault();
        // let form = event.currentTarget as any
        let user = {
          username: username,
          password: password,
          usertype: usertype,
        };
        console.log('usertype',usertype)
        console.log(username,password,usertype)
        registerApi()
      };
    
    const submitLogout = (event: FormEvent) => {
        event.preventDefault();
    };

    const registerApi = async () =>{
      const res = await fetch(`${api_server}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username,
          password,
          usertype,
        }),
      });
      // return res;
      const result = await res.json()
      console.log('result',result)
      if(res.status === 200){
        localStorage.setItem('token', result)
        
        setRegisterResult({type:'success',message:'Register Success'})
      }else{
        console.log(result.message)
        setRegisterResult({type:'fail',message:result.message})
      }
    }

    const resultMessage = 
    <div style={registerResult.type === "fail"?{color:'red'}:{color:'black'}}>
      {registerResult.message}
    </div>

  return (
  <div className={style.body} style={{marginLeft:'22.5%',marginTop:'2em'}}>
    <div className={style.container}>
    <h1 className="">Register</h1>
      <form className="block" style={{lineHeight:'3em'}}>
          <div>
            <label> Username : </label>
            <input type="text" className="border-2 block text-center" value={username} onChange={(e) => setUsername(e.currentTarget.value)}></input>
          </div>
          <div>
            <label> Password : </label>
            <input type="text" className="border-2 block text-center" value={password} onChange={(e) => setPassword(e.currentTarget.value)}></input>
          </div>
          <div>
            <label htmlFor=""> User type : </label>
            <select value={usertype} onChange={(e)=> setUsertype(e.currentTarget.value)} name="" id="">
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="claims">Claims</option>
              <option value="finance">Finance</option>
              <option value="read_only">Read Only</option>
            </select>
          </div>
          
            <button type="submit" onClick={submitButton}>Register</button> 
            <div>{resultMessage}</div>
      </form>
    </div>
    </div>
  )
}

import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { env } from "../env";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUsertype] = useState("")

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
      if(res.status === 200){
        localStorage.setItem('token', result)
      }else{
        console.log(result.message)
      }
    }

    useEffect(()=>{
    },[])

  return (
  <div style={{marginLeft:'22.5%',marginTop:'2em'}}>
    <h1 className="">Register</h1>
    <form className="block">
        <label> Username: </label>
        <input type="text" className="border-2 block text-center" value={username} onChange={(e) => setUsername(e.currentTarget.value)}></input>
        <label> Password: </label>
        <input type="text" className="border-2 block text-center" value={password} onChange={(e) => setPassword(e.currentTarget.value)}></input>
        <label htmlFor="">Usertype: </label>
        <select value={usertype} onChange={(e)=> setUsertype(e.currentTarget.value)} name="" id="">
          <option value="Agent">Agent</option>
          <option value="Admin">Admin</option>
        </select>
        <input type="submit" onClick={submitButton}/> 
    </form>
    </div>
  )
}

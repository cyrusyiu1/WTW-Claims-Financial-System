import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { env } from "../env";
import { loginSuccess, logoutAction } from '../redux/auth/action';
import { IRootState } from '../redux/state';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()

    const isAuthenticated = useSelector(
        (state: IRootState) => state.auth.isAuthenticated
      );

    const api_server = env.apiOrigin;

      const loginApi = async () =>{
        const res = await fetch(`${api_server}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            username,
            password,
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

    const submitButton = (event: FormEvent) => {
      event.preventDefault();
      // let form = event.currentTarget as any
      let user = {
        username: username,
        password: password,
      };
      console.log(username,password)
      loginApi()
      dispatch(loginSuccess())
      // console.log(isAuthenticated)
    };

    const logoutButton = (event: FormEvent) => {
      event.preventDefault();
      localStorage.removeItem('token');
      dispatch(logoutAction())
    }

  return (
    <div style={{marginLeft:'22.5%',marginTop:'2em'}}>
        <h1>Login</h1>
        {!isAuthenticated?
                <form className="block">
                <label>Username:</label>
                <input type="text" className="border-2 block text-center" value={username} onChange={(e) => setUsername(e.currentTarget.value)}></input>
                <label>Password:</label>
                <input type="text" className="border-2 block text-center" value={password} onChange={(e) => setPassword(e.currentTarget.value)}></input>
                <input type="submit" onClick={submitButton}/> 
            </form>
            :
            <button onClick={logoutButton}>Logout</button>
            }

        
    </div>
  )
}

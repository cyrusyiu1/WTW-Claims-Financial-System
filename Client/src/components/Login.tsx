import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { env } from "../env";
import { loginSuccess, logoutAction } from '../redux/auth/action';
import { IRootState } from '../redux/state';
import style from '../style/login.module.css'

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginResult,setLoginResult] = useState({type:"",message:""})

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
          setLoginResult({type:'success',message:'Login Success'})
          dispatch(loginSuccess())
        }else{
            console.log(result.message)
            setLoginResult({type:'fail',message:result.message})
        }
      }

    const submitButton = (event: FormEvent) => {
      event.preventDefault();
      // let form = event.currentTarget as any
      let user = {
        username: username,
        password: password,
      };
      // console.log(username,password)
      loginApi()
      // dispatch(loginSuccess())
      // console.log(isAuthenticated)
    };

    const logoutButton = (event: FormEvent) => {
      event.preventDefault();
      localStorage.removeItem('token');
      dispatch(logoutAction())
    }

    const resultMessage = 
      <div style={loginResult.type === "fail"?{color:'red'}:{color:'black'}}>
        {loginResult.message}
      </div>

  return (
    <div className={style.body} style={{marginLeft:'22.5%',marginTop:'2em'}}>
        <div className={style.container}>
        {!isAuthenticated ? <h1>Login</h1> : <h1>Logout</h1>
        }
        {!isAuthenticated?
                <form  style={{lineHeight:'3em'}}>
                  <div>
                    <label>Username : </label>
                    <input type="text" className="border-2 block text-center" value={username} onChange={(e) => setUsername(e.currentTarget.value)}></input>
                  </div>
                  <div>
                    <label>Password : </label>
                    <input type="text" className="border-2 block text-center" value={password} onChange={(e) => setPassword(e.currentTarget.value)}></input>
                  </div>
                <button type="submit" onClick={submitButton}>Login</button> 
                <div>{resultMessage}</div>
            </form>
            :
            <button type="submit" onClick={logoutButton}>Logout</button>
          }
        </div>
    </div>
  )
}

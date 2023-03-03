import React, { ReactElement, useEffect, useState } from 'react'
import { env } from "../env";
import style from '../style/admin.module.css'


export default function Admin() {
    const [allUser,setAllUser] = useState([{id:"",username:"",password:"",userType:"",permissionsLevel:0,authorityLevel:0}])
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedAuthorityUser, setSelectedAuthorityUser] = useState("");
    const [index,setIndex] = useState("0")
    const [authorityIndex,setAuthorityIndex] = useState("0")
    const [permissionsLevel, setPermissionsLevel] = useState(0)
    const [authorityLevel, setAuthorityLevel] = useState(0)
    const [random, setRandom] = useState(0)

    const api_server = env.apiOrigin;

    let url_string = window.location.href; //window.location.href
    let url = new URL(url_string);
    let id = url.searchParams.get("id");

    const allUsersInfoApi = async () => {
        const res = await fetch(`${api_server}/users/getAllUsername`);
        // return res;
        const result = await res.json()
        console.log(result)
        setAllUser(result)
        // set the initial username
        setSelectedUser(result[0].username)
        setSelectedAuthorityUser(result[0].username)
        setRandom(Math.random() * 1000)
    }

    const changePermissionsApi = async () =>{
      const res = await fetch(`${api_server}/users/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username : selectedUser,
          permissionsLevel,
        }),
      });
      // const result = await res.json()
      if(res.status === 200){
        allUsersInfoApi()
      }
    }

    const changeAuthoritysApi = async () => {
      const res = await fetch(`${api_server}/users/authority`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username : selectedAuthorityUser,
          authorityLevel,
        }),
      });
      // const result = await res.json()
      if(res.status === 200){
        allUsersInfoApi()
      }
    }

    const changePermissionsLevel = (event:any) => {
        const newValue = Number(event.target.value);
        if (isNaN(newValue) || event.target.value === '') {
            setPermissionsLevel(0);
          } else {
            setPermissionsLevel(newValue);
          }
    }

    const changeAuthorityLevel =(event:any) => {
      const newValue = Number(event.target.value);
      if (isNaN(newValue) || event.target.value === '') {
          setAuthorityLevel(0);
        } else {
          setAuthorityLevel(newValue);
        }
    }

    const handleSelectUser = (index:number) => {
        setIndex(index.toString())
        setSelectedUser(allUser[index].username)
    }

    const handleSelectAuthorityUser = (index:number) => {
        setAuthorityIndex(index.toString())
        setSelectedAuthorityUser(allUser[index].username)
    }

    const submitPermissionsChange = (e:any) =>{
      e.preventDefault()
      changePermissionsApi()
    }

    const submitAuthorityChange = (e:any)=>{
      e.preventDefault()
      changeAuthoritysApi()
    }

    // const getUserApi = async () => {
    //     const res = await fetch(`${api_server}/users/getUserById/${id}`)
    //     return res
    //   }

    useEffect(()=>{
      allUsersInfoApi()
      // getUserApi()
    },[])

    useEffect(()=>{
        setPermissionsLevel(allUser[parseInt(index)].permissionsLevel)
        setAuthorityLevel(allUser[parseInt(index)].authorityLevel)
    },[random])

    useEffect(()=>{
        setPermissionsLevel(allUser[parseInt(index)].permissionsLevel)
    },[index])

    useEffect(()=>{
      setAuthorityLevel(allUser[parseInt(authorityIndex)].authorityLevel)
    },[authorityIndex])

  return (
    <div style={{marginLeft:'22.5%',marginTop:'2em'}}>
        <h1>Admin Panel</h1>
        {/* <button onClick={allUsersInfoApi}>check</button> */}
        <div className={style.container}>
          <div >
            <form className={style.form} action="" onSubmit={submitPermissionsChange}>
              <span>Username: 
                <select name="" id="" onChange={(e)=>handleSelectUser(parseInt(e.currentTarget.value))}>
                    {allUser.map((user:any,index)=>(
                        <option value={index} key={user.id} >{user.username}</option>
                    ))}
                </select>
                </span>
                <span>
                  <label htmlFor=""> Permission Level :</label>
                  <input type="text" value={permissionsLevel} onChange={(e)=> changePermissionsLevel(e)}/>
                </span>
                <input type="submit"/>
            </form>
          </div>
          <div >
            <form className={style.form} action="" onSubmit={submitAuthorityChange}>
              <span>Username: 
                  <select name="" id="" onChange={(e)=>handleSelectAuthorityUser(parseInt(e.currentTarget.value))}>
                      {allUser.map((user:any,index)=>(
                          <option value={index} key={user.id} >{user.username}</option>
                      ))}
                  </select>
                </span>
                <span>
                  <label htmlFor=""> Authority Level  :</label>
                  <input type="text" value={authorityLevel} onChange={(e)=> changeAuthorityLevel(e)}/>
                </span>
                <input type="submit"/>
            </form>
          </div>
        </div>
    </div>
  )
}


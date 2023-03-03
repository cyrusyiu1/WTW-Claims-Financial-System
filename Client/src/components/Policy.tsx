import { unwatchFile } from 'fs';
import { env } from "../env";
import React, { useState,useEffect } from 'react'
import PolicyList from './PolicyList';

export default function Policy() {
    // const [allUser,setAllUser] = useState([{id:"",username:"",password:"",userType:"",permissionsLevel:0,authorityLevel:0}])
    const [policyNumber, setPolicyNumber] = useState("");
    const [policyType, setPolicyType] = useState('');
    const [policyTerm, setPolicyTerm] = useState('');
    const [coverageAmount, setCoverageAmount] = useState('');
    const [premium, setPremium] = useState('');
    const [claims, setClaims] = useState('');
    const [index,setIndex] = useState("0");
    const [authorityLevel, setAuthorityLevel] = useState("")
    const [allPolicy,setAllPolicy] = useState([{id:'',policy_number:'',policy_type:'',policy_term:'',coverage_amount:'',premium:''}])


    const api_server = env.apiOrigin;

    useEffect(()=>{
      getAuthorityApi()
    },[])

    const submitPolicyApi = async () => {
        const res = await fetch(`${api_server}/users/postPolicy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                policyNumber,
                policyType,
                policyTerm,
                coverageAmount,
                premium,
                claims,
                authorityLevel,
            }),
            
          });
        if(res.status === 200){
            getAllPolicyApi()
        }
    }

    const getAllPolicyApi = async () => {
        const res = await fetch(`${api_server}/users/getAllPolicy`)
        const result = await res.json()
        // console.log(result)
        setAllPolicy(result)
    }

    const getAuthorityApi = async () => {
      const res = await fetch(`${api_server}/users/getUserById`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
      const result = await res.json()
      setAuthorityLevel(result.authorityLevel)
    }
    
    const handleSubmitPolicy=(e:any)=>{
        e.preventDefault()
        submitPolicyApi()
    }



  return (
    <div style={{marginLeft:'25%',marginRight:'5%'}}>
        <h1>Policy Manangement System</h1>
        <form onSubmit={handleSubmitPolicy} style={{display:'flex',flexDirection:'column',textAlign:'left',lineHeight:'2em'}}>
            <label> Policy number: </label>
            <input type="text" value={policyNumber} onChange={(e)=>setPolicyNumber(e.currentTarget.value)}/>
            <label> Policy type: </label>
            <input type="text" value={policyType} onChange={(e)=>{setPolicyType(e.currentTarget.value)}}/>
            <label> PolicyTerm: </label>
            <input type="text" value={policyTerm} onChange={(e)=>{setPolicyTerm(e.currentTarget.value)}}/>
            <label> Coverage amount: </label>
            <input type="text" value={coverageAmount} onChange={(e)=>{setCoverageAmount(e.currentTarget.value)}}/>
            <label> Premium: </label>
            <input type="text" value={premium} onChange={(e)=>{setPremium(e.currentTarget.value)}}/>
            <label> Claims: </label>
            <input type="text" value={claims} onChange={(e)=>{setClaims(e.currentTarget.value)}}/>
            <div style={{textAlign:'center'}}>
              <input type="submit"/>
            </div>
        </form>
    </div>
  )
}

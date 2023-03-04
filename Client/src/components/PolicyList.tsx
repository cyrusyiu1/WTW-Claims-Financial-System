import React, { useEffect, useState } from 'react'
import { env } from "../env";

export default function PolicyList() {
    const [policyId,setPolicyId] = useState('')
    const [editMode,setEditMode] = useState(false) 
    const [policyNumber, setPolicyNumber] = useState("");
    const [policyType, setPolicyType] = useState('');
    const [policyTerm, setPolicyTerm] = useState('');
    const [coverageAmount, setCoverageAmount] = useState('');
    const [claims,setClaims] = useState('')
    const [premium, setPremium] = useState('');
    const [index, setIndex] = useState('0')
    const [random, setRandom] = useState(-1)
    const [allPolicy,setAllPolicy] = useState<{id:'',policy_number:'',policy_type:'',policy_term:'',coverage_amount:'',premium:'',claims_amount:''}[]>([])

    const api_server = env.apiOrigin;

    useEffect(()=>{
        getAllPolicyApi()
    },[])

    useEffect(()=>{
      if (random == -1) {
        return;
      }
        setPolicyNumber(allPolicy[parseInt(index)].policy_number)
        setPolicyType(allPolicy[parseInt(index)].policy_type)
        setPolicyTerm(allPolicy[parseInt(index)].policy_term)
        setCoverageAmount(allPolicy[parseInt(index)].coverage_amount)
        setPremium(allPolicy[parseInt(index)].premium)
        setClaims(allPolicy[parseInt(index)].claims_amount)
        console.log('123',allPolicy)
        console.log(index)
    },[random])

    const getAllPolicyApi = async () => {
      const res = await fetch(`${api_server}/users/getAllPolicy`)
      const result = await res.json()
      setAllPolicy(result)
  }

    const editPostApi = async (policyId:string) => {
        const res = await fetch(`${api_server}/users/editPolicy`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            policyId,
            policyNumber,
            policyType,
            policyTerm,
            coverageAmount,
            premium,
            claims
          }),
        });
        if(res.status === 200){
            getAllPolicyApi()
        }
      }

    const deletePostApi = async (policyId:string) => {
        const res = await fetch(`${api_server}/users/deletePolicy`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            policyId: policyId,
          }),
        });
        if(res.status === 200){
            getAllPolicyApi()
        }
      }

    const editPolicy = (policyId:string,index:number) => {
        // editPostApi(policyId)
        setEditMode(!editMode)
        setPolicyId(policyId)
        setIndex(index.toString())
        setRandom(Math.random() * 1000)
    }

    const deletePolicy = (policyId:string,index:number) =>{
        deletePostApi(policyId)
    }

    const handleSave = (e:any) => {
        e.preventDefault()
        setEditMode(!editMode)
        editPostApi(policyId)
    }

  return (
    <div style={{marginLeft:'25%',marginRight:'5%'}}>
    <h1>Policy List</h1>
    <div style={{flexFlow:'wrap',marginLeft:'4%'}}>
    {!editMode?
        allPolicy.map((policy:any,index:number)=>(
            <div key={policy.id}>
                    <div style={{border:'solid 2px',marginLeft:'5px',marginRight:'2px',marginBottom:'5px',padding:'10px'}}>
                        <div style={{textAlign:"left",marginBottom:'5px'}}>
                            <div>Username: {policy.username}</div>
                            <div>Policy number: {policy.policy_number}</div>
                            <div>Policy type: {policy.policy_type}</div>
                            <div>PolicyTerm: {policy.policy_term}</div>
                            <div>Coverage amount: {policy.coverage_amount}</div>
                            <div>Premium: {policy.premium}</div>
                            <div>Claims Amount: {policy.claims_amount}</div>
                        </div>
                        <div>
                        <button onClick={() => editPolicy(policy.id,index)}>Edit</button>
                        <button onClick={() => deletePolicy(policy.id,index)}>Delete</button>
                        </div>
                    </div>
            </div>
        ))
        :
        <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',border:'solid 2px',marginLeft:'2px',marginRight:'2px',marginBottom:'5px',padding:'10px'}}>
            <label htmlFor="">Policy number:</label>
            <input type="text" onChange={(e)=>setPolicyNumber(e.currentTarget.value)} value={policyNumber}/>
            <label htmlFor="">Policy type:</label>
            <input type="text" onChange={(e)=>setPolicyType(e.currentTarget.value)} value={policyType}/>
            <label htmlFor="">PolicyTerm:</label>
            <input type="text" onChange={(e)=>setPolicyTerm(e.currentTarget.value)} value={policyTerm}/>
            <label htmlFor="">Coverage amount:</label>
            <input type="text" onChange={(e)=>setCoverageAmount(e.currentTarget.value)} value={coverageAmount}/>
            <label htmlFor="" >Premium:</label>
            <input type="text" onChange={(e)=>setPremium(e.currentTarget.value)} value={premium}/>
            <label htmlFor="" >Claims Amount:</label>
            <input type="text" onChange={(e)=>setClaims(e.currentTarget.value)} value={claims}/>
            <div>
                <input type="submit" />
            </div>
        </form> 
        }
    </div>
    </div>
  )
}
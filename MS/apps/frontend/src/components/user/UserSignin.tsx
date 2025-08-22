"use client"

import api from "@/util/api";
import { useState } from "react"

export default function UserSignin(){
    const [username,setUsername]=useState("")
    const [password,setPassword] = useState("")
    const [notification,setNotification] = useState("")

    async function handleSignin(){
        try {
            const {data:response}=await api.post(`/api/v2/user/signin`,{
                username,
                password
            })   
            
            setNotification('User Signin successfull')
            console.log('response received : ',response);
            
        } catch (error) {
            console.log('ERROR : ',error);
            
            setNotification("Signin failed")
        }
    }

    return (
        <>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleSignin}>Sign-up</button>
            <div>
                <p>Notification</p>
                <p>{notification}</p>
            </div>
        </>
    )
}
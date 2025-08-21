import api from "@/util/api";
import axios from "axios";
import { useState } from "react"

export default function UserSignup(){
    const [username,setUsername]=useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [notification,setNotification] = useState("")

    async function handleSignup(){
        try {
            const {data:response}=await api.post(`/api/v2/user/signup`,{
                username,
                email,
                password
            })   
            
            setNotification('User Signup successfull')
            console.log('response received : ',response);
            
        } catch (error) {
            console.log('ERROR : ',error);
            
            setNotification("Signup failed")
        }
    }

    return (
        <>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleSignup}>Sign-up</button>
            <div>
                <p>Notification</p>
                <p>{notification}</p>
            </div>
        </>
    )
}
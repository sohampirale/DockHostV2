import api from "@/util/api";
import { useState } from "react"

export default function BackendSignup(){
    const [username,setUsername]=useState("")
    const [password,setPassword] = useState("")
    const [notification,setNotification] = useState("")

    async function handleSignup(){
        try {
            const {data:response}=await api.post(`/api/v2/backend/signup`,{
                username,
                password
            })   
            
            setNotification('Backend Signup successfull')
            console.log('response received : ',response);
            
        } catch (error) {
            console.log('ERROR : ',error);
            
            setNotification("Backend Signup failed")
        }
    }

    return (
        <>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleSignup}>Sign-up Backend</button>
            <div>
                <p>Notification</p>
                <p>{notification}</p>
            </div>
        </>
    )
}
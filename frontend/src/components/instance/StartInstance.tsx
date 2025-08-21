"use client"
import api from "@/util/api"
import { useState } from "react"

export default function StartInstance(){
    const [SSH_PUB_KEY,setSSH_PUB_KEY]=useState("")
    const [notification,setNotification] = useState("")

    async function handleStartInstance(){
        try {
            const {data:response}=await api.post("/api/v2/instance",{
                SSH_PUB_KEY,
            })
            console.log('response received : ',response);
            setNotification('Instances created successfully')
        } catch (error) {
            console.log('ERROR : ',error);
            setNotification('Failed ot create the instance')
        }
    }

    return (
        <>
            <input type="text" value={SSH_PUB_KEY} onChange={(e)=>setSSH_PUB_KEY(e.target.value)}/>
            <button>Start Instance</button>
            <div>
                <p>Notification</p>
                <div>
                    {notification}
                </div>
            </div>
        </>
    )
}
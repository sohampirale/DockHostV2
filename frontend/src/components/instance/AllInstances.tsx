"use client"

import api from "@/util/api"
import { useEffect, useState } from "react"

export default function AllInstances(){
    const [allMyInstances,setAllMyInstances]=useState([])
    const [notification,setNotification] = useState("")

    async function getAllInstances(){
        try {
            const {data:response}=await api.get("/api/v2/user/instance")
            const allInstances=response.data;
            console.log('All Instances of user : ',allInstances);
            setAllMyInstances(allInstances)
        } catch (error) {
            setNotification('Failed to retrive your instances')
        }

    }

    useEffect(()=>{
        getAllInstances()
    },[])

    async function handleStopInstance(backendId:string){
        try {
            const {data:response} = await api.put("/api/v2/instance/stop",{
                    backendId
            })

            setNotification("Instance stopped successfully")
        } catch (error) {
            setNotification('Failed to stop instance')
        }
    }

    async function handleResumeInstance(backendId:string){
        try {
            const {data:response} = await api.put("/api/v2/instance/resume",{
                backendId
            })

            setNotification("INstance resumed successfully")
        } catch (error) {
            setNotification('Failed to resume instance')
        }
    }

    async function handleDeleteInstance(backendId:string){
        try {
            const {data:response} = await api.delete("/api/v2/instance",{
                data:{
                    backendId
                }
            })

            setNotification("INstance deleted successfully")
        } catch (error) {
            setNotification('Failed to delete instance')
        }
    }

    return (
        <>
            {allMyInstances.map((instance:{
                _id:string,
                backendId:string,
                userId:string,
                running:boolean
            })=>(
                <div key={instance._id}>
                    <p>BackendId : {instance.backendId}</p>
                    <p>UserID : {instance.userId}</p>
                    <p>Active : {instance.running}</p>
                    {
                        instance.running ? (
                            <>
                                <button onClick={()=>handleStopInstance(instance.backendId)}>
                                    Stop Instance
                                </button>
                            </>
                        ):(
                            <>
                                <button onClick={()=>handleResumeInstance(instance.backendId)}>Resume Instance</button>
                            </>
                        )
                    }
                    <button>Delete Instance</button>
                </div>
            ))}

        <div>
            <p>Notification</p>
            <div>
                {notification}
            </div>
        </div>
        </>
    )
}
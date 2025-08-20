import dotenv from "dotenv"
dotenv.config();
import express from "express"
const app =express()

/**
 * 1.Signup user
 * 2.Signin user
 * 3.Signup backend
 * 4.Get DockHostApiKey for backend
 * 5.User :
 *  5.start new instance
 *  6.stop a instance
 *  7.delete an instance
 */

app.get("/",(req,res)=>{
    res.send("Hello World!")
})

app.post('/api/v2/user/auth/signup',(req,res)=>{
    
})
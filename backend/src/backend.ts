import dotenv from "dotenv";
dotenv.config();

import { io, Socket } from "socket.io-client";
import { execFile } from "child_process";
import * as path from "path";
import * as fs from "fs";

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, execSync } from "node:child_process";
    
const __dirname = dirname(fileURLToPath(import.meta.url));

let LAN_IP;

try {
  const scriptPath = path.join(__dirname, "bashfiles", "GET_LAN_IP.sh");

  console.log("Script path is:", scriptPath);
  console.log("Exists?", fs.existsSync(scriptPath));

  execFile(
    scriptPath,
    [],
    {
      
    },
    (error, stdout, stderr) => {
      if (error) {
        console.log('Failed to get LAN IP');
        
        return;
      }
      if (stderr) {
        console.log('Failed to get LAN IP');
        return;
      }
      console.log(`✅ Success:\n${stdout}`);
      LAN_IP=stdout.trim()
      console.log('LAN_IP  : ',LAN_IP);
      
    }
  );
} catch (error) {
  
}

const socket: Socket = io(process.env.MAIN_SERVER_BACKEND_URL as string, {
  query: {
    role: "backend",
  },
  auth: {
    DOCKHOST_API_KEY: process.env.DOCKHOST_API_KEY,
    LAN_IP
  },
});

function isPortOpen(PORT_NO:number){
  try {
    const stdout = execSync(`ss -tuln | grep -E ':(${PORT_NO}|${PORT_NO + 1}|${PORT_NO + 2}) ' `, { stdio: "pipe" }).toString();
    return stdout.trim().length === 0;
  } catch (error:any) {
    if (error.status === 1) {
      return true;
    }
    throw error; 
  }
}

socket.on("connect", () => {
  console.log("✅ Connected with server");
});

socket.on("start_container", (data: { SSH_PUB_KEY: string; USERNAME: string,startingPortNo:number }) => {
  console.log("📥 data:", data);

  const { SSH_PUB_KEY, USERNAME,startingPortNo } = data;
  const scriptPath = path.join(__dirname, "bashfiles", "start_container.sh");

  console.log("Script path is:", scriptPath);
  console.log("Exists?", fs.existsSync(scriptPath));
  let PORT_NO=startingPortNo

  while(1){
    if(!isPortOpen(PORT_NO)){
      PORT_NO+=3
    } else {
      console.log('PORT : ',PORT_NO+' is open');
      
      break;
    }
  }
  

  execFile(
    scriptPath,
    [],
    {
      env: {
        ...process.env, 
        SSH_PUB_KEY,
        USERNAME,
        TCP_PORT:PORT_NO.toString(),
        HTTP_PORT:(PORT_NO+1).toString(),
        HTTPS_PORT:(PORT_NO+2).toString()
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Command failed: ${error.message}`);
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:"Failed to spawn the instance"
        })
        return;
      }
      if (stderr) {
        socket.emit(USERNAME,{
          status:501,
          success:false,
          message:"Error occured whiel spawing the instance"
        })
        return;
      }
      console.log(`✅ Success:\n${stdout}`);
      
      socket.emit(USERNAME,{
        status:201,
        success:true,
        message:"Instance spawned successfully",
        PORT_NO
      })
    }
  );
});

socket.on("stop_container", (data: { USERNAME: string }) => {
  console.log("📥 data:", data);

  const { USERNAME } = data;
  const scriptPath = path.join(__dirname, "bashfiles", "stop_container.sh");

  console.log("Script path is:", scriptPath);
  console.log("Exists?", fs.existsSync(scriptPath));

  execFile(
    scriptPath,
    [],
    {
      env: {
        ...process.env,
        USERNAME,
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:'Failed to stop instance'
        })
        return;
      }
      if (stderr) {
        console.error(`⚠️ Error output: ${stderr}`);
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:'Error while resuming instance'
        })
        return;
      }
      socket.emit(USERNAME,{
        status:200,
        success:true,
        message:'Instance stopped successfully'
      })
      console.log(`✅ Success:\n${stdout}`);
    }
  );
});

socket.on("resume_container", (data: { USERNAME: string }) => {
  console.log("📥 data:", data);

  const { USERNAME } = data;
  const scriptPath = path.join(__dirname, "bashfiles", "resume_container.sh");

  console.log("Script path is:", scriptPath);
  console.log("Exists?", fs.existsSync(scriptPath));

  execFile(
    scriptPath,
    [],
    {
      env: {
        USERNAME,
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Command failed: ${error.message}`);
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:'Error while resuming instance'
        })
        return;
      }
      if (stderr) {
        console.error(`⚠️ Error output: ${stderr}`);
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:'Error while resuming instance'
        })
        return;
      }
      socket.emit(USERNAME,{
        status:200,
        success:true,
        message:'Instance resumed successfully'
      })
      console.log(`✅ Success:\n${stdout}`);
    }
  );
});

socket.on("delete_container", (data: { USERNAME: string }) => {
  console.log("📥 data:", data);

  const { USERNAME } = data;
  const scriptPath = path.join(__dirname, "bashfiles", "delete_container.sh");

  console.log("Script path is:", scriptPath);
  console.log("Exists?", fs.existsSync(scriptPath));

  execFile(
    scriptPath,
    [],
    {
      env: {
        USERNAME
      },
    },
    (error, stdout, stderr) => {
      if (error) {
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:"Failed to delete container"
        })
        console.error(`❌ Command failed: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`⚠️ Error output: ${stderr}`);
        socket.emit(USERNAME,{
          status:500,
          success:false,
          message:"Error while deleting container"
        })
        return;
      }

      socket.emit(USERNAME,{
        status:200,
        success:true,
        message:"Instance deleted successfully"
      })

      console.log(`✅ Success deleting container :\n${stdout}`);
    }
  );

});

socket.on('check_if_container_exists',(data:{USERNAME:string})=>{
  const {USERNAME} = data;
  
  exec(`docker ps -a --format ${USERNAME}`, (err, stdout) => {
    if (err) {
      console.log('err : ',err);
      
      return socket.emit(USERNAME,false)
    }
    const exists = stdout.split("\n").includes(USERNAME);
    console.log('exists = ',exists);
    
    socket.emit(USERNAME,exists)
  });
})

socket.on('check_if_container_running',(data:{USERNAME:string})=>{
  const {USERNAME} = data;
  
  exec(`docker ps --format ${USERNAME}`, (err, stdout) => {
    if (err) {      
      return socket.emit(USERNAME,false)
    }
    const running = stdout.split("\n").includes(USERNAME);
    console.log('running = ',running);
    socket.emit(USERNAME,running)
  });
})

socket.on("connect_error", (err: Error) => {
  console.error("❌ Connection error:", err.message);
});

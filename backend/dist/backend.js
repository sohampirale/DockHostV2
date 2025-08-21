import dotenv from "dotenv";
dotenv.config();
import { io, Socket } from "socket.io-client";
import { execFile } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const socket = io(process.env.MAIN_SERVER_BACKEND_URL, {
    query: {
        role: "backend",
    },
    auth: {
        DOCKHOST_API_KEY: process.env.DOCKHOST_API_KEY,
    },
});
socket.on("connect", () => {
    console.log("✅ Connected with server");
});
socket.on("start_container", (data) => {
    console.log("📥 data:", data);
    const { SSH_PUB_KEY, USERNAME } = data;
    const scriptPath = path.join(__dirname, "bashfiles", "start_container.sh");
    console.log("Script path is:", scriptPath);
    console.log("Exists?", fs.existsSync(scriptPath));
    execFile(scriptPath, [], {
        env: {
            ...process.env, // keep existing env vars
            SSH_PUB_KEY,
            USERNAME,
        },
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Command failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Error output: ${stderr}`);
            return;
        }
        console.log(`✅ Success:\n${stdout}`);
    });
});
socket.on("stop_container", (data) => {
    console.log("📥 data:", data);
    const { USERNAME } = data;
    const scriptPath = path.join(__dirname, "bashfiles", "stop_container.sh");
    console.log("Script path is:", scriptPath);
    console.log("Exists?", fs.existsSync(scriptPath));
    execFile(scriptPath, [], {
        env: {
            ...process.env,
            USERNAME,
        },
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Command failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Error output: ${stderr}`);
            return;
        }
        console.log(`✅ Success:\n${stdout}`);
    });
});
socket.on("resume_container", (data) => {
    console.log("📥 data:", data);
    const { USERNAME } = data;
    const scriptPath = path.join(__dirname, "bashfiles", "resume_container.sh");
    console.log("Script path is:", scriptPath);
    console.log("Exists?", fs.existsSync(scriptPath));
    execFile(scriptPath, [], {
        env: {
            USERNAME,
        },
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Command failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Error output: ${stderr}`);
            return;
        }
        console.log(`✅ Success:\n${stdout}`);
    });
});
socket.on("delete_container", (data) => {
    console.log("📥 data:", data);
    const { USERNAME } = data;
    const scriptPath = path.join(__dirname, "bashfiles", "delete_container.sh");
    console.log("Script path is:", scriptPath);
    console.log("Exists?", fs.existsSync(scriptPath));
    execFile(scriptPath, [], {
        env: {
            USERNAME
        },
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Command failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Error output: ${stderr}`);
            return;
        }
        console.log(`✅ Success:\n${stdout}`);
    });
});
socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
});
//# sourceMappingURL=backend.js.map
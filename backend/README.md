# DockHost Backend

The backend service is a worker node that connects to the DockHost main server and manages Docker containers for user instances. Each backend machine can host one container per user and handles the complete container lifecycle.

## Overview

The backend service acts as a bridge between the main server's orchestration layer and Docker containers. It maintains a persistent WebSocket connection to receive commands and manages local container operations including creation, port allocation, SSH setup, and lifecycle management.

## Architecture

```
Main Server ──WebSocket──> Backend Service ──Docker API──> Ubuntu Containers
     ↑                           ↑
   Commands              Container Management
```

### Key Responsibilities

- **Connection Management**: Establish and maintain WebSocket connection with main server
- **Container Operations**: Create, start, stop, and delete Docker containers
- **Port Allocation**: Automatically assign available port ranges for SSH/HTTP/HTTPS
- **SSH Configuration**: Set up authorized_keys with user's public key
- **Resource Management**: Track and manage local container resources

## Features

- **Auto-reconnection**: Automatically reconnects to main server on connection loss
- **Port Management**: Intelligent allocation of 3 consecutive ports per container
- **Container Isolation**: Each user gets their own dedicated Ubuntu container
- **SSH Ready**: Containers spawn with SSH service pre-configured
- **Real-time Communication**: Instant command processing via WebSocket

## Prerequisites

- Docker installed and running
- Node.js 16+ 
- Network access to main server
- Sufficient system resources for containers

## Installation

1. Clone the DockHost repository:
```bash
git clone https://github.com/sohampirale/DockHostV2.git
cd DockHostV2/backend
```

2. Install dependencies:
```bash
npm install
```

3. Register this backend machine:
   - Go to the main DockHost web interface
   - Navigate to backend registration
   - Create account with username and password
   - Copy the generated API key

## Configuration

The backend requires 2 environment variables:

```bash
export DOCKHOST_API_KEY="your_api_key_here"
export MAIN_SERVER
```

### Getting Your API Key

1. Access the DockHost frontend (typically `http://localhost:3000`)
2. Register as a backend operator
3. Login and navigate to the backend dashboard
4. Copy your unique API key

## Usage

### Starting the Backend Service

```bash
# Set your API key
export DOCKHOST_API_KEY="your_api_key_from_frontend"
export MAIN_SERVER_BACKEND_URL="localhost:3001"
# Start the service
npm start
```
Refer to .env.exmaple inside /backend

The service will:
1. Connect to the main server via WebSocket
2. Authenticate using your API key
3. Begin listening for container management commands
4. Automatically appear as "available" in the main server

### Logs and Monitoring

The backend provides detailed logging for:
- Connection status with main server
- Container creation and management operations
- Port allocation and conflicts
- SSH setup and configuration
- Error handling and recovery

## Container Management

### Container Specifications

Each container created by this backend:

- **Image**: `sohampirale/instance` (Ubuntu with SSH pre-configured)
- **Ports**: 3 consecutive host ports mapped to container ports 22, 80, 443
- **SSH**: Automatically configured with user's public key
- **Networking**: Bridge network with port forwarding
- **Storage**: Writable filesystem (no volumes currently)

### Port Allocation Logic

```
Starting from port 1024:
- Check if ports X, X+1, X+2 are free
- If available: assign X→22, X+1→80, X+2→443
- If not: try X+3, X+4, X+5
- Continue until finding 3 consecutive free ports
```

Example allocation:
- SSH: `localhost:1024` → `container:22`
- HTTP: `localhost:1025` → `container:80` 
- HTTPS: `localhost:1026` → `container:443`

### Container Lifecycle

1. **Create**: Pull image, configure ports, set up SSH keys
2. **Start**: Boot container and start SSH service
3. **Stop**: Pause container (data preserved)
4. **Delete**: Remove container and free allocated ports

## WebSocket Communication

### Connection Protocol

```javascript
// Connection establishment
const socket = io('ws://MAIN_SERVER_BACKEND_URL', {
  auth: {
    DOCKHOST_API_KEY: process.env.DOCKHOST_API_KEY
  }
});
```

### Supported Commands

The backend responds to these WebSocket events:

- `create-container`: Create new container for user
- `start-container`: Start existing container
- `stop-container`: Stop running container
- `delete-container`: Remove container permanently
- `list-containers`: Return containers for specific user

### Response Format

```javascript
{
  success: boolean,
  message: string,
  data: {
    containerId: string,
    ports: {
      ssh: number,
      http: number,
      https: number
    }
  }
}
```

## Security

### API Key Authentication

- Each backend must authenticate with valid API key
- Keys are generated per backend registration
- Invalid keys result in connection rejection

### Container Security

- SSH key-based authentication only
- No password authentication enabled
- Containers run in isolated environment
- Port access limited to allocated ranges

## Troubleshooting

### Common Issues

**Connection Refused**
```bash
Error: connect ECONNREFUSED main-server:3001
```
- Check main server is running
- Verify network connectivity
- Confirm WebSocket port (3001) is accessible

**Invalid API Key**
```bash
Error: Authentication failed
```
- Verify API key is correct
- Re-register backend if needed
- Check environment variable is set

**Port Conflicts**
```bash
Error: Port already in use
```
- Backend automatically finds alternative ports
- Check Docker port bindings: `docker ps`
- Restart backend service if port allocation stuck

**Container Creation Failed**
```bash
Error: Unable to create container
```
- Verify Docker daemon is running: `docker info`
- Check image availability: `docker pull sohampirale/instance`
- Ensure sufficient system resources

### Debug Mode

Run with enhanced logging:
```bash
DEBUG=dockhost:* npm start
```
### Development

```bash
# Install dependencies
npm install

# Compiling source code
npm run build

# Starting the backend
node dist/backend.js

```

### Project Structure

```
backend/
├── src/
│   ├── server.js          # Main backend service
├── package.json
|── tsconfig.json
└── README.md
```

## Performance

### Resource Requirements

**Minimum per backend:**
- 2GB RAM
- 10GB free disk space
- 2 CPU cores

**Estimated per container:**
- 512MB RAM
- 1GB disk space
- 0.5 CPU cores

### Scaling

- Each backend supports 10-50 containers (hardware dependent)
- Multiple backends can connect to same main server
- Horizontal scaling by adding more backend machines

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/backend-improvement`
3. Make changes and test thoroughly
4. Ensure all containers can be created/managed properly
5. Submit pull request

## Support

For backend-specific issues:
- Check logs for detailed error messages
- Verify Docker and Node.js versions
- Test container operations manually
- Report issues with system specifications
---

**Backend Management Dashboard**: Access container status and logs through the main DockHost web interface after connecting this backend.

# DockHost

A distributed container orchestration platform that provides on-demand Ubuntu instances accessible via SSH. Think AWS EC2, but built with Docker containers and designed for simplicity.

## Overview

DockHost allows users to spawn, manage, and access containerized Ubuntu environments through a web interface. Each instance runs in an isolated Docker container with full SSH access, HTTP/HTTPS port forwarding, and persistent storage until deletion.

The platform consists of three main components:
- **Frontend**: Web interface for instance management
- **Main Server**: Orchestration layer handling user requests and backend coordination  
- **Backend Machines**: Worker nodes that host the actual containers

## Architecture

``` 
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend  │────│ Main Server  │────│ Backend Machines│
│  (Next.js)  │    │  (Express +  │    │   (Docker +     │
│             │    │   Socket.io  │    │   Containers)   │
└─────────────┘    │  + MongoDB)  │    └─────────────────┘
                   └───────|──────┘              
                           |                      
                           |         ┌─────────────────┐
                           |         │ Backend Machines│
                           .──────── |  (Docker +      │
                                     │   Containers)   │
                                     └─────────────────┘
```

### How It Works

1. **User Registration**: Users create accounts through the web interface
2. **Backend Registration**: Backend machines connect to the main server using API keys
3. **Instance Creation**: Users request instances, main server selects available backend
4. **Container Deployment**: Backend creates Ubuntu container with SSH access
5. **SSH Access**: Users connect via SSH using provided credentials and port mapping

## Key Features

- **Distributed Architecture**: Multiple backend machines for horizontal scaling
- **SSH Access**: Full terminal access to Ubuntu containers
- **Port Mapping**: Automatic allocation of SSH (22), HTTP (80), and HTTPS (443) ports
- **Instance Management**: Start, stop, delete operations via web interface
- **Data Persistence**: Container data persists through stop/start cycles
- **Real-time Communication**: WebSocket-based coordination between components

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- MongoDB (handled by Docker Compose)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sohampirale/DockHostV2.git
cd DockHostV2
```

2. Start the main services:
```bash
docker-compose up -d
```

This starts:
- Main server on `http://localhost:3001`
- Frontend on `http://localhost:3000`
- MongoDB database

3. Access the web interface at `http://localhost:3000`

### Adding Backend Machines

1. Register a backend through the web interface
2. Get your DOCKHOST_API_KEY key from the dashboard
3. Run the backend service:
```bash
# On the backend machine
npm install
DOCKHOST_API_KEY=your_api_key
npm run build
npm start
```

The backend will automatically connect to your main server and be available for container deployment.

## Usage

### Creating an Instance

1. Sign up/Login to the web interface
2. Click "Create Instance"
3. Provide your SSH public key
4. Wait for deployment (typically 30-60 seconds)
5. Use the provided SSH command to connect

### Accessing Your Instance

```bash
ssh -p 1024 root@your-backend-ip
```

Port numbers are automatically assigned (SSH: 1024, HTTP: 1025, HTTPS: 1026 in this example).
Ports numbers will change as multiple instances are spawned in a backend.

### Instance Management

- **Start**: Resume a stopped instance
- **Stop**: Pause instance (data preserved)  
- **Delete**: Permanently remove instance and all data

## Technical Details

### Container Specifications

- **Base Image**: `sohampirale/instance` (Ubuntu with SSH pre-configured)
- **SSH Access**: Automatic authorized_keys setup
- **Port Exposure**: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Storage**: Writable container filesystem

### Backend Communication

Backend machines connect to the main server via WebSocket (Socket.io) using API key authentication. The main server maintains real-time awareness of:
- Available backend machines
- Container status and resource usage
- Port allocation across backends

### Port Management

Each backend automatically manages port allocation:
- Finds 3 consecutive available ports
- Maps container ports 22, 80, 443 to host ports
- Handles port conflicts and reuse

## Project Structure

```
dockhost/
├── frontend/           # Next.js web interface
├── main-server/        # Express orchestration server
├── backend/           # Backend machine service
├── docker-compose.yml # Main services setup
└── README.md         # This file
```

## Development

Each component has its own development setup. See individual README files:
- [Frontend Setup](./frontend/README.md)
- [Main Server Setup](./main-server/README.md)  
- [Backend Setup](./backend/README.md)

## Roadmap

- **Volume Support**: Persistent storage across container recreations
- **Global Tunneling**: Integration with ngrok for public access
- **Resource Limits**: CPU/memory constraints per container
- **Multi-OS Support**: Additional container images beyond Ubuntu

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact [@sohampirale](https://github.com/sohampirale).

---

Built with ❤️ by [Soham Pirale](https://github.com/sohampirale)

# DockHost Main Server

The main server is the orchestration hub of DockHost, managing user authentication, backend coordination, and container lifecycle requests. It provides RESTful APIs and WebSocket communication to coordinate between the frontend interface and distributed backend machines.

## Overview

The main server acts as the central control plane for the DockHost platform. It handles user management, maintains real-time connections with backend machines, and orchestrates container operations across the distributed infrastructure. Built with Express.js and Socket.io, it provides both HTTP APIs for the frontend and WebSocket communication for backend coordination.

## Architecture

```
Frontend (Next.js) ──HTTP/REST──> Main Server ──WebSocket──> Backend Machines
                                      ↕                            ↓
                                  MongoDB                   Docker Containers
```

### Core Responsibilities

- **User Authentication**: Registration, login, and session management
- **Backend Orchestration**: Maintain connections and coordinate with worker nodes
- **Container Management**: Route container requests to appropriate backends
- **Instance Tracking**: Monitor container states across all backends
- **API Gateway**: Provide unified interface for frontend operations

## Features

- **RESTful API**: Complete user and instance management endpoints
- **WebSocket Hub**: Real-time communication with multiple backend machines
- **Backend Discovery**: Automatic registration and health monitoring of workers
- **Load Distribution**: Route container requests to available backends
- **Database Integration**: Persistent storage with MongoDB
- **Session Management**: Secure user authentication and authorization

## Prerequisites

- Node.js 16+
- MongoDB database
- Network access for WebSocket connections
- Sufficient resources for concurrent connections

## Installation

M-1 : Start with docker compose up from root dire

M-2 :

1. Navigate to the main-server directory:
```bash
cd DockHostV2/main-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/DockHostV2

# Security
BACKEND_ACCESS_TOKEN_SECRET=your_jwt_secret_here
USER_ACCESS_TOKEN_SECRET=your_backend_jwt_secret_here
FRONTEND_URL=your_frontend_url_for_cors_access

```

### Database Setup

The main server automatically connects to MongoDB and creates necessary collections:

- **users**: User accounts and authentication data
- **backends**: Registered backend machines and their status  
- **instances**: Container instances and their metadata
- **sessions**: Active user sessions

## Usage

### Starting the Main Server

```bash
npm run build
npm start
```

The server will:
1. Connect to MongoDB database
2. Initialize Express.js server on specified port
3. Start Socket.io WebSocket server
4. Begin accepting frontend requests and backend connections
5. Log startup status and configuration

### API Endpoints

#### User Authentication

```bash
# User registration
POST /api/v2/user/signup
Content-Type: application/json
{
  "username": "user123",
  "email": "user@example.com", 
  "password": "securepassword",
  "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2E..."
}

# User login
POST /api/v2/user/signin
Content-Type: application/json
{
  "username": "user123",
  "password": "securepassword"
}
```

#### Backend Management

```bash
# Register new backend
POST /api/v2/backend/signup
Content-Type: application/json
{
  "username": "backend-admin",
  "password": "securepassword"
}

# Backend login (get JWT API key)
POST /api/v2/backend/signin
Content-Type: application/json
{
  "username": "backend-admin",
  "password": "securepassword"
}
```

#### Container Management

```bash
# Create new instance
POST /api/v2/user/instance
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "sshPublicKey": "ssh-rsa AAAAB3NzaC1yc2E..."
}

# Get all user instances
GET /api/v2/user/instance
Authorization: Bearer <jwt_token>

# Resume instance
PUT /api/v2/user/instance/resume
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "instanceId": "user123-container"
}

# Stop instance  
PUT /api/v2/user/instance/stop
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "instanceId": "user123-container"
}

# Delete instance
DELETE /api/v2/user/instance
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "instanceId": "user123-container"
}
```

### WebSocket Events

#### Backend Communication

The main server handles these WebSocket events from backends:

```javascript
// Backend connection with JWT authentication
socket.on('authenticate', (data) => {
  const { DOCKHOST_API_KEY, LAN_IP } = data;
  // Verify JWT token and register backend
  // Add to activeBackends Map with socket reference
});

// Instance operation responses
socket.on('instance-created', (data) => {
  const { instanceId, ports, status } = data;
  // Update database and notify frontend
});

```

#### Frontend Communication

Real-time updates sent to frontend:

```javascript
// Instance status changes
socket.emit('instance-updated', {
  instanceId: 'user123-container',
  status: 'running',
  sshDetails: {
    host: '192.168.1.100',
    port: 1024,
    username: 'root'
  }
});

// Backend connectivity changes
socket.emit('backend-status', {
  backendId: 'backend-01',
  status: 'connected',
  containerCount: 5
});
```

## Backend Coordination

### Connection Management

The main server maintains persistent WebSocket connections with all registered backends:

```javascript
// Backend registration flow
1. Backend connects with API key
2. Main server validates credentials
3. Backend added to active pool
4. Connection health monitored
5. Auto-cleanup on disconnect
```

### Container Request Routing

When users request containers:

```javascript
// Request routing logic
1. Receive container request from frontend
2. Query all connected backends for availability
3. Select backend with capacity (currently first available)
4. Forward request to selected backend
5. Track operation status
6. Return result to frontend
```

### Load Balancing

Current implementation uses simple availability-based routing:
- Round-robin through connected backends
- Basic health checking via WebSocket ping
- Automatic failover to available backends

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  passwordHash: String,
  sshPublicKey: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Backends Collection

```javascript
{
  _id: ObjectId,
  name: String (unique),
  apiKey: String (unique),
  status: 'connected' | 'disconnected',
  lastSeen: Date,
  containerCount: Number,
  createdAt: Date
}
```

### Instances Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  backendId: ObjectId,
  containerId: String,
  status: 'creating' | 'running' | 'stopped' | 'deleted',
  sshPort: Number,
  httpPort: Number,
  httpsPort: Number,
  createdAt: Date,
  lastActivity: Date
}
```

## Security

### Authentication & Authorization

- **JWT Tokens**: Secure session management with configurable expiration
- **Password Hashing**: bcrypt with configurable rounds
- **API Key Authentication**: Unique keys for backend machine access
- **CORS Protection**: Configurable origins for cross-origin requests

### Data Protection

- **Input Validation**: Comprehensive request validation and sanitization
- **SQL Injection Prevention**: MongoDB parameterized queries
- **Rate Limiting**: Configurable request rate limits per endpoint
- **Error Handling**: Secure error responses without sensitive data exposure

## Monitoring & Logging

### Logging Levels

```bash
# Available log levels
DEBUG=dockhost:*          # All debug information
DEBUG=dockhost:auth       # Authentication events only  
DEBUG=dockhost:backend    # Backend communication only
DEBUG=dockhost:container  # Container operations only
```

### Health Monitoring

```bash
# Health check endpoint
GET /health
Response: {
  "status": "healthy",
  "database": "connected",
  "backends": 3,
  "uptime": 86400
}
```

### Metrics Collection

The server tracks:
- Active user sessions
- Connected backend count
- Container creation/deletion rates
- API request metrics
- WebSocket connection statistics

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
Error: MongoNetworkError: failed to connect to server
```
- Verify MongoDB is running: `systemctl status mongod`
- Check connection string in environment variables
- Ensure network connectivity to MongoDB host

**Backend Authentication Failures**
```bash
Error: Invalid API key from backend
```
- Verify backend API key matches database
- Check backend registration process
- Regenerate API key if necessary

**High Memory Usage**
```bash
Warning: Memory usage above 80%
```
- Monitor active WebSocket connections: `/health`
- Check for memory leaks in long-running connections
- Consider scaling horizontally with load balancer

**Container Request Timeouts**
```bash
Error: Backend request timeout after 30s
```
- Check backend machine connectivity
- Verify Docker daemon status on backends
- Monitor backend resource usage

### Debug Mode

Enable comprehensive logging:
```bash
DEBUG=dockhost:* NODE_ENV=development npm start
```

### Database Debugging

```bash
# Connect to MongoDB directly
mongo mongodb://localhost:27017/dockhost

# Check collections
show collections
db.users.find()
db.instances.find()
db.backends.find()
```

## Development

### Local Development Setup

```bash
# Install dependencies
npm install

# Start MongoDB locally
docker run -d -p 27017:27017 --name mongo mongo:latest

# Run in development mode
npm run dev

# Run tests
npm test

# Linting and formatting
npm run lint
npm run format
```

### Project Structure

```
main-server/
├── src/
│   ├── index.ts               # Express application and Socket.io setup
│   ├── routes/
│   │   ├── user.routes.ts     # User authentication and instance management
│   │   └── backend.routes.ts  # Backend registration and authentication
│   ├── controllers/
│   │   ├── user.controllers.ts    # User and instance operation handlers
│   │   └── backend.controllers.ts # Backend management handlers
│   ├── middlewares/
│   │   └── authMiddleware.ts      # JWT authentication middleware
│   ├── models/
│   │   ├── user.model.ts          # User data model
│   │   ├── instance.model.ts      # Container instance model
│   │   └── backend.model.ts       # Backend machine model
│   ├── helpers/
│   │   ├── ApiResponse.ts         # Standardized API response format
│   │   ├── ApiError.ts            # Error handling utilities
│   │   ├── token.ts               # JWT token generation/verification
│   │   └── handleApiError.ts      # Centralized error handling
│   ├── lib/
│   │   └── connectDB.ts           # MongoDB connection setup
│   ├── constants/
│   │   └── index.ts               # Application constants
│   └── public/
│       └── index.html             # Server status page
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Performance Optimization

### Recommended Hardware

**Minimum Requirements:**
- 4GB RAM
- 2 CPU cores  
- 50GB disk space
- 1Gbps network connection

**Production Recommendations:**
- 8GB+ RAM
- 4+ CPU cores
- 100GB+ SSD storage
- Load balancer for high availability

### Scaling Considerations

- **Horizontal Scaling**: Multiple main server instances with load balancer
- **Database Optimization**: MongoDB replica sets for high availability
- **Connection Pooling**: Configure MongoDB connection limits
- **Caching**: Redis integration for session and metadata caching

## API Documentation

Complete API documentation is available at `/api/docs` when running in development mode, or can be generated using:

```bash
npm run docs
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/main-server-improvement`
3. Implement changes with comprehensive tests
4. Update API documentation if needed
5. Submit pull request with detailed description

## Support

For main server issues:
- Check server logs for detailed error information
- Verify database connectivity and schema
- Monitor WebSocket connection health
- Review environment configuration

---

**Admin Dashboard**: Access server metrics, backend status, and user management through the web interface at `/admin` (admin authentication required).

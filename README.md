# Merlin

A deployment platform for automatically building and serving static web applications from Git repositories.

## Architecture

Merlin consists of four microservices:

- **client**: Next.js frontend for managing deployments
- **upload-service**: Clones repositories, uploads to R2 storage, and queues builds
- **deploy-service**: Worker service that processes build queue and builds projects
- **request-handler**: Serves static files for deployed applications

## Prerequisites

- Node.js 18+
- Redis
- Cloudflare R2 account (or AWS S3-compatible storage)
- TypeScript

## Installation

```bash
# Install dependencies for all services
cd client && npm install
cd ../upload-service && npm install
cd ../deploy-service && npm install
cd ../request-handler && npm install
```

## Configuration

Create `.env` files in each service directory with the following variables:

### upload-service/.env
```env
PORT=3000
R2_ENDPOINT=your-r2-endpoint
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
BUCKET_NAME=merlin
```

### deploy-service/.env
```env
R2_ENDPOINT=your-r2-endpoint
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
BUCKET_NAME=merlin
```

### request-handler/.env
```env
PORT=3001
R2_ENDPOINT=your-r2-endpoint
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
BUCKET_NAME=merlin
```

## Running

Start each service in a separate terminal:

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Upload service
cd upload-service
npm run dev

# Terminal 3: Deploy service (worker)
cd deploy-service
npm run dev

# Terminal 4: Request handler
cd request-handler
npm run dev

# Terminal 5: Client
cd client
npm run dev
```

## Build

```bash
# Build all services
cd client && npm run build
cd ../upload-service && npm run build
cd ../deploy-service && npm run build
cd ../request-handler && npm run build
```

## How It Works

1. User submits a Git repository URL via the client
2. Upload service clones the repository and uploads files to R2
3. Deployment ID is added to Redis build queue
4. Deploy service processes the queue: downloads from R2, runs `npm install && npm run build`
5. Built files are uploaded back to R2
6. Request handler serves the static files at `/{deployment-id}`

## Project Structure

```
merlin/
├── client/              # Next.js frontend
├── upload-service/      # Repository upload and queue management
├── deploy-service/      # Build worker service
└── request-handler/     # Static file server
```


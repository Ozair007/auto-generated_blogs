# System Architecture

## Overview

The auto-generated blog application is a full-stack system consisting of:

- **Frontend**: React SPA served via nginx
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL
- **AI Service**: HuggingFace Inference API
- **Infrastructure**: AWS (EC2, ECR, CodeBuild)

## Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP
       ▼
┌─────────────────┐
│  Frontend (80)  │  React SPA (nginx)
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│ Backend (3000)  │  Express API
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
    ▼        ▼
┌────────┐ ┌──────────────────┐
│  PG    │ │ HuggingFace API  │
│  DB    │ │ (Article Gen)    │
└────────┘ └──────────────────┘
```

## Components

### Frontend
- **Technology**: React 19, TypeScript, Vite, Tailwind CSS
- **Port**: 80 (production), 5173 (development)
- **Features**: Article listing, article detail view, responsive design
- **Deployment**: Docker container with nginx

### Backend
- **Technology**: Node.js, Express, TypeScript
- **Port**: 3000
- **Features**:
  - REST API for articles
  - PostgreSQL integration
  - AI article generation
  - Daily cron job for article generation
- **Deployment**: Docker container

### Database
- **Technology**: PostgreSQL 16
- **Port**: 5432
- **Schema**: Single `articles` table with id, title, content, timestamps
- **Deployment**: Docker container (local) or managed service (production)

### AI Service
- **Provider**: HuggingFace Inference API
- **Model**: mistralai/Mistral-7B-Instruct-v0.2 (configurable)
- **Usage**: Generates article titles and content
- **Error Handling**: If the API fails, article generation will fail and errors will be logged

## Deployment Architecture

### AWS Infrastructure

```
GitHub Repository
       │
       │ Push
       ▼
┌──────────────┐
│  CodeBuild   │  Builds Docker images
└──────┬───────┘
       │
       │ Push
       ▼
┌──────────────┐
│     ECR      │  Stores Docker images
└──────┬───────┘
       │
       │ Pull
       ▼
┌──────────────┐
│     EC2      │  Runs containers
│  (t2.micro)  │
└──────────────┘
```

### Deployment Flow

1. **Code Push**: Developer pushes code to GitHub
2. **CodeBuild Trigger**: CodeBuild automatically starts (or manually triggered)
3. **Build Images**: CodeBuild builds both frontend and backend Docker images
4. **Push to ECR**: Images are tagged and pushed to ECR repositories
5. **EC2 Deployment**: EC2 instance pulls latest images and restarts containers

### EC2 Setup

- **Instance Type**: t2.micro (free tier)
- **OS**: Amazon Linux 2
- **Software**: Docker, Docker Compose, AWS CLI
- **Security Groups**: 
  - Port 80 (HTTP) - Frontend
  - Port 3000 (Backend API) - Optional, can be internal only
  - Port 5432 (PostgreSQL) - Internal only

### Container Orchestration

Containers are orchestrated using Docker Compose:

- **frontend**: React app served by nginx
- **backend**: Node.js API server
- **postgres**: PostgreSQL database

All containers run on the same EC2 instance and communicate via Docker network.

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `HUGGINGFACE_API_KEY`: HuggingFace API key
- `AI_MODEL`: AI model identifier
- `GENERATE_ON_STARTUP`: Generate article on startup (true/false)

### Frontend
- `VITE_API_URL`: Backend API URL

## Scheduling

Article generation is handled by `node-cron` running inside the backend container:

- **Schedule**: Daily at midnight UTC (00:00)
- **Process**: Calls HuggingFace API to generate title and content
- **Storage**: Saves generated article to PostgreSQL
- **Logging**: All generation events are logged

## Security Considerations

1. **API Keys**: Stored as environment variables, never committed to git
2. **Database**: Access restricted to backend container only
3. **CORS**: Configured to allow frontend origin only
4. **Security Groups**: Minimal port exposure on EC2
5. **HTTPS**: Should be added in production (using ALB or CloudFront)

## Scaling Considerations

Current architecture is designed for small-scale deployment. For scaling:

1. **Database**: Move to RDS for managed PostgreSQL
2. **Load Balancing**: Add Application Load Balancer
3. **Container Orchestration**: Consider ECS or EKS for multiple instances
4. **Caching**: Add Redis for article caching
5. **CDN**: Use CloudFront for frontend static assets

## Monitoring

Recommended monitoring setup:

1. **CloudWatch**: Logs from EC2 and containers
2. **Health Checks**: `/health` endpoint on backend
3. **Database Monitoring**: PostgreSQL logs and metrics
4. **API Monitoring**: Track article generation success/failure rates

## Cost Optimization

- Use free tier resources where possible (t2.micro EC2)
- Use HuggingFace free tier for AI generation
- Consider Reserved Instances for long-term deployment
- Monitor ECR storage costs
- Use S3 for backups instead of EBS snapshots


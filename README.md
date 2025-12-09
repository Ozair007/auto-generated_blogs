# Auto-Generated Blog - Full-Stack Application

A full-stack blog application that automatically generates articles using AI, built with React, Node.js, PostgreSQL, Docker, and deployed on AWS.

## Project Structure

```
.
├── frontend/          # React + TypeScript frontend application
├── backend/           # Node.js + TypeScript backend API
├── infra/             # Infrastructure configuration (Docker, AWS, buildspec.yml)
└── docs/              # Documentation
```

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **AI Service**: HuggingFace Inference API
- **Infrastructure**: Docker, AWS ECR, CodeBuild

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose)
- HuggingFace API key (optional, free tier available)

### Local Development

#### Quick Start with Docker Compose

1. Clone the repository
2. Set up environment variables:

    ```bash
    # Backend
    cd backend
    cp .env.example .env
    # Edit .env with your HuggingFace API key

    # Frontend
    cd ../frontend
    cp .env.example .env
    ```

3. Start all services:

    ```bash
    cd ../infra
    docker-compose up -d
    ```

4. Seed the database (optional):

    ```bash
    cd ../backend
    npm install
    npm run seed
    ```

5. Access the application:
    - Frontend: http://localhost
    - Backend API: http://localhost:3000
    - API Health: http://localhost:3000/health

#### Manual Setup

See individual README files in `frontend/` and `backend/` directories for detailed setup instructions.

## Features

- ✅ Automatic daily article generation using AI
- ✅ RESTful API for article management
- ✅ Modern React frontend with responsive design
- ✅ PostgreSQL database for persistence
- ✅ Docker containerization
- ✅ AWS native deployment pipeline (ECR, CodeBuild)
- ✅ Scheduled article generation with node-cron

## Deployment

### AWS Setup

1. **Create ECR Repositories**:
    - Create two repositories in Amazon ECR:
        - `blog-backend`
        - `blog-frontend`
    - Note the full repository URIs (format: `account-id.dkr.ecr.region.amazonaws.com/repo-name`)

2. **Set Up AWS CodeBuild**:
    - Create a CodeBuild project in AWS Console
    - Source: Connect to your GitHub repository
    - Buildspec: Use `infra/buildspec.yml` from the repository
    - Environment:
        - Image: `aws/codebuild/standard:7.0` (or latest)
        - Privileged: Enable (required for Docker)
        - Service role: Create/select IAM role with ECR push permissions
    - Environment Variables:
        - `ECR_REPOSITORY_BACKEND`: Full ECR URI (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com/blog-backend`)
        - `ECR_REPOSITORY_FRONTEND`: Full ECR URI (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com/blog-frontend`)
        - `AWS_DEFAULT_REGION`: AWS region (e.g., `us-east-1`)
    - Webhook: Enable webhook to trigger builds on push to `main`/`master` branch

3. **Deploy to AWS**:
    - **Option A - ECS/Fargate**: Use the built images from ECR to deploy to ECS
    - **Option B - Elastic Beanstalk**: Use the `imagedefinitions.json` artifact created by buildspec.yml
    - **Option C - ECS with EC2**: Deploy ECS tasks using the ECR images

4. **Deploy**:
    - Push to `main` or `master` branch to trigger automatic CodeBuild
    - Or manually trigger build from CodeBuild console
    - CodeBuild will build Docker images and push to ECR
    - Deploy the images to your chosen AWS service (ECS, Elastic Beanstalk, etc.)

See `docs/ARCHITECTURE.md` for detailed deployment instructions and architecture overview.

# Backend API

Node.js + Express + TypeScript backend for the auto-generated blog application.

## Features

- RESTful API for articles (list, retrieve)
- PostgreSQL database integration
- AI-powered article generation using HuggingFace Inference API
- Daily automated article generation using node-cron
- Docker support

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- HuggingFace API key (required)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blogdb
DB_USER=postgres
DB_PASSWORD=postgres
HUGGINGFACE_API_KEY=your_api_key_here
AI_MODEL=deepseek-ai/DeepSeek-V3.2:novita
GENERATE_ON_STARTUP=true
```

### Database Setup

The database schema is automatically created on server startup. Make sure PostgreSQL is running and accessible.

### Running Locally

```bash
# Development mode with hot reload
npm run dev

# Build and run production
npm run build
npm start

# Seed database with initial articles
npm run seed
```

## API Endpoints

### Health Check

- `GET /health` - Returns server status

### Articles

- `GET /api/articles` - Get all articles (ordered by creation date, newest first)
- `GET /api/articles/:id` - Get a single article by ID

## Article Generation

Articles are automatically generated daily at midnight UTC using a cron job. The system uses HuggingFace Inference API to generate article titles and content.

If the AI API fails, the article generation will fail and the error will be logged. Ensure your HuggingFace API key is valid and the service is accessible.

## Docker

```bash
# Build image
docker build -t blog-backend .

# Run container
docker run -p 3000:3000 --env-file .env blog-backend
```

# Frontend Application

React + TypeScript + Vite frontend for the auto-generated blog application.

## Features

- Modern React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Responsive design
- Article listing and detail views

## Setup

### Prerequisites

- Node.js 18+
- Backend API running (default: http://localhost:3000)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/           # API client configuration
├── components/    # React components
│   ├── ArticleCard.tsx
│   ├── ArticleDetail.tsx
│   ├── ArticleList.tsx
│   └── Layout.tsx
├── pages/         # Page components
│   ├── HomePage.tsx
│   └── ArticlePage.tsx
└── App.tsx        # Main app component with routing
```

## Docker

```bash
# Build image
docker build -t blog-frontend .

# Run container
docker run -p 80:80 blog-frontend
```

The frontend is served using nginx in production mode.


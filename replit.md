# CraftBriz - Fusion Starter

## Project Overview
This is a full-stack React + Express.js application built with Vite. It includes a React frontend with modern UI components and an Express backend API.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: TanStack React Query
- **Routing**: React Router
- **Package Manager**: pnpm

## Project Structure
```
client/           # React frontend application
  components/     # React components (UI components, layout)
  hooks/          # Custom React hooks
  lib/            # Utility functions
  pages/          # Page components (routing)
  App.tsx         # Main React app
  global.css      # Global styles

server/           # Express.js backend
  routes/         # API route handlers
  index.ts        # Express server setup
  node-build.ts   # Production server entry point

shared/           # Shared utilities between client and server
```

## Development
- The development server runs on port 5000
- Frontend and backend are integrated using Vite's proxy functionality
- API endpoints are available at `/api/*`

## Deployment
- Uses VM deployment target for full-stack application
- Build process creates optimized client and server bundles
- Production server serves both frontend and API

## Recent Changes (Setup in Replit)
- Configured Vite dev server for Replit environment (host 0.0.0.0, port 5000)
- Installed missing @radix-ui/react-alert-dialog dependency
- Set up development workflow using pnpm
- Configured deployment settings for production
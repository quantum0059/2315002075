# Notification System Design

## Overview
This document outlines the architecture and design of the notification system evaluation project. The system is built as a TypeScript monorepo with a clear separation of concerns.

## Project Structure

```
Drive/
├── logging_middleware/          # Reusable logging package
├── notification_app_be/         # Express backend
├── notification_app_fe/         # Next.js frontend
├── notification_system_design.md
└── .gitignore
```

## Architecture Components

### 1. Logging Middleware (`logging_middleware/`)
- **Purpose**: Reusable logging middleware package
- **Technology**: TypeScript, Express
- **Scope**: Centralized logging functionality for use across backend and other services
- **Package**: `@notification/logging-middleware`

### 2. Backend (`notification_app_be/`)
- **Purpose**: API server and business logic
- **Technology**: Express.js, TypeScript
- **Port**: 3001 (configurable via .env)
- **Dependencies**: logging_middleware, cors, dotenv
- **Package**: `@notification/app-backend`

### 3. Frontend (`notification_app_fe/`)
- **Purpose**: User interface
- **Technology**: Next.js 14 (App Router), React 18, TypeScript
- **Port**: 3000 (default Next.js)
- **Features**: Server-side rendering, static optimization, built-in API routes
- **Package**: `@notification/app-frontend`

## Technology Stack

### Core
- **Language**: TypeScript 5.3
- **Runtime**: Node.js 20+
- **Package Manager**: npm (with workspaces)

### Backend
- **Framework**: Express.js 4.18
- **Middleware**: CORS, logging middleware
- **Configuration**: dotenv

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **HTTP Client**: Axios
- **Styling**: (To be implemented)

### Development Tools
- **Linting**: ESLint 8
- **Formatting**: Prettier 3
- **Type Checking**: TypeScript compiler
- **Development Watch**: tsx (for backend), Next.js dev server (for frontend)
- **Concurrency**: Concurrently (for monorepo dev)

## Development Workflow

### Installation
```bash
npm install
```

### Development
```bash
npm run dev          # Runs both backend and frontend
```

### Building
```bash
npm run build        # Builds all workspaces
```

### Linting & Formatting
```bash
npm run lint         # Lint all workspaces
npm run format       # Format all files
npm run format:check # Check formatting without changes
```

## Configuration Files

### Root Level
- **package.json**: Monorepo configuration with workspaces
- **tsconfig.json**: Base TypeScript configuration (extended by each workspace)
- **.eslintrc.json**: ESLint rules (base, extended by each workspace)
- **.prettierrc.json**: Prettier formatting rules
- **.gitignore**: Git ignore patterns

### Per-Workspace
- **package.json**: Workspace-specific dependencies and scripts
- **tsconfig.json**: Extended from root, workspace-specific compiler options
- **.eslintrc.json**: Extended from root (with overrides if needed)
- **.env.example**: Environment variable template

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Code Quality Standards

### TypeScript Strict Mode
- All files compiled with strict type checking
- Explicit return types required for functions
- Null/undefined checks enforced

### Linting Rules
- No unused variables (exception: prefixed with `_`)
- No explicit `any` types (warnings)
- Console usage limited to `warn` and `error`

### Formatting
- 2-space indentation
- Single quotes for strings
- Trailing commas (ES5 style)
- Line width: 100 characters
- LF line endings

## Monorepo Structure Benefits

1. **Code Reusability**: Logging middleware shared across projects
2. **Unified Tooling**: Single ESLint, Prettier, TypeScript configuration
3. **Simplified Dependencies**: Shared dev dependencies at root level
4. **Easy Development**: Single `npm install` and `npm run dev`
5. **Consistency**: Unified code style and standards

## Implementation Roadmap

> Features to be implemented after project skeleton completion

1. **Logging Middleware**
   - Request/response logging
   - Error logging
   - Performance metrics

2. **Backend API**
   - Notification endpoints
   - Database integration
   - Authentication/Authorization

3. **Frontend**
   - Notification display components
   - Real-time notification updates
   - User preferences UI

## Testing Strategy

> To be defined in implementation phase

- Unit tests
- Integration tests
- E2E tests with Playwright (tentative)

## Deployment

> To be defined in implementation phase

- Docker containerization
- CI/CD pipeline setup
- Cloud deployment options

## Next Steps

1. Implement logging middleware interfaces
2. Develop backend API endpoints
3. Create frontend components
4. Integrate frontend and backend
5. Add comprehensive testing
6. Deploy to cloud platform

# Notification System - Root README

## Project Overview

A TypeScript monorepo notification system with a modern tech stack:
- **Frontend**: Next.js 14 with App Router
- **Backend**: Express.js
- **Shared**: Reusable logging middleware
- **All TypeScript**: 100% type safety

## Quick Start

### Prerequisites
- Node.js 20+
- npm 8+

### Setup
```bash
# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Scripts
```bash
npm run build          # Build all packages
npm run lint           # Lint all packages
npm run format         # Format code with Prettier
npm run format:check   # Check formatting
```

## Project Structure
```
Drive/
├── logging_middleware/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.json
│
├── notification_app_be/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   └── .env.example
│
├── notification_app_fe/
│   ├── src/
│   │   └── page.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .eslintrc.json
│   └── .env.example
│
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
├── .gitignore
└── notification_system_design.md
```

## Workspaces

### 1. logging_middleware
Reusable logging package for Express applications.

```bash
cd logging_middleware
npm run build
```

### 2. notification_app_be
Express backend API server.

```bash
cd notification_app_be
npm run dev      # Development with file watch
npm run build    # Production build
npm start        # Run production build
```

### 3. notification_app_fe
Next.js frontend application.

```bash
cd notification_app_fe
npm run dev      # Development server
npm run build    # Production build
npm start        # Run production build
```

## Configuration

### TypeScript
- **Strict mode** enabled globally
- **Path aliases** in frontend: `@/*` → `./src/*`
- **Module resolution**: Node.js compatible

### ESLint
- TypeScript parser configured
- Strict type-checking rules
- Unused variable warnings
- Limited console usage

### Prettier
- 2-space indentation
- 100-character line width
- Single quotes
- LF line endings

## Environment Setup

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

## Development Guidelines

1. **TypeScript**: All code must be TypeScript
2. **Type Safety**: Use strict mode, no `any` without justification
3. **Code Style**: Run `npm run format` before committing
4. **Linting**: All files must pass `npm run lint`
5. **Imports**: Use path aliases where applicable

## Documentation
- See [notification_system_design.md](./notification_system_design.md) for detailed architecture

## License
MIT

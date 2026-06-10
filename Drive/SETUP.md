# Project Setup & Installation Guide

## Pre-Installation Checklist

- [ ] Node.js 20+ installed
- [ ] npm 8+ installed
- [ ] Git initialized (if needed)

## Installation Steps

### 1. Install Root Dependencies
```bash
cd Drive
npm install
```

This command will:
- Install root-level dev dependencies
- Install dependencies for all workspaces
- Create `node_modules` at root and each workspace

### 2. Verify Installation
```bash
npm run build
```

Expected output:
- All packages build successfully to `dist/` directories
- No TypeScript errors

### 3. Check Configuration
```bash
npm run lint
npm run format:check
```

Expected output:
- ESLint runs without errors across all workspaces
- Prettier verification passes

## Development Setup

### Terminal 1: Backend Development
```bash
cd notification_app_be
npm run dev
```

Runs backend with file watching on `http://localhost:3001`

### Terminal 2: Frontend Development
```bash
cd notification_app_fe
npm run dev
```

Runs frontend dev server on `http://localhost:3000`

### Or Run Together (from root)
```bash
npm run dev
```

This runs both services concurrently using `concurrently`.

## Environment Configuration

### Backend Setup (.env file)
Create `notification_app_be/.env` from template:
```bash
cp notification_app_be/.env.example notification_app_be/.env
```

File contents:
```
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend Setup (.env.local file)
Create `notification_app_fe/.env.local` from template:
```bash
cp notification_app_fe/.env.example notification_app_fe/.env.local
```

File contents:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Common Tasks

### Build for Production
```bash
npm run build
```

Outputs:
- `logging_middleware/dist/` - Built package
- `notification_app_be/dist/` - Compiled backend
- `notification_app_fe/.next/` - Next.js build

### Format Code
```bash
npm run format
```

Formats all `.ts`, `.tsx`, `.js`, `.json`, `.md` files.

### Lint Code
```bash
npm run lint
```

Checks all files for ESLint violations.

### Type Check Frontend
```bash
cd notification_app_fe
npm run type-check
```

### Upgrade Dependencies
```bash
npm outdated              # Show outdated packages
npm update               # Update to latest versions
```

## Project-Specific Commands

### Logging Middleware
```bash
cd logging_middleware
npm run build            # Build package
npm run watch            # Watch and rebuild
npm run lint             # Lint code
```

### Backend
```bash
cd notification_app_be
npm run dev              # Development with watch
npm run build            # Production build
npm start                # Run production build
npm run lint             # Lint code
npm run format           # Format code
```

### Frontend
```bash
cd notification_app_fe
npm run dev              # Development server
npm run build            # Production build
npm start                # Run production build
npm run lint             # Lint code
npm run format           # Format code
npm run type-check       # Type checking
```

## Troubleshooting

### Issue: `npm install` fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Port 3000 or 3001 already in use
**Solution**: 
```bash
# Change backend port in notification_app_be/.env
PORT=3002

# Or kill existing processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Issue: TypeScript errors in IDE
**Solution**: 
```bash
# Rebuild TypeScript in all workspaces
npm run build

# Or restart TypeScript server in your IDE (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")
```

### Issue: ESLint errors in IDE
**Solution**:
```bash
# Run format to fix most issues
npm run format

# Run lint to see remaining issues
npm run lint
```

## First Development Cycle

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Verify Setup**
   ```bash
   npm run build
   npm run lint
   ```

3. **Start Services**
   ```bash
   # Terminal 1
   cd notification_app_be && npm run dev
   
   # Terminal 2
   cd notification_app_fe && npm run dev
   ```

4. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

5. **Begin Implementation**
   - Start with logging middleware
   - Then backend endpoints
   - Finally frontend components

## Version Info

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 8+ | Package manager |
| TypeScript | 5.3 | Type system |
| Next.js | 14 | Frontend framework |
| Express | 4.18 | Backend framework |
| React | 18 | UI library |
| ESLint | 8 | Linting |
| Prettier | 3 | Formatting |

## IDE Configuration (VS Code)

### Recommended Extensions
- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)
- Next.js

### Settings (.vscode/settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Next Steps

1. ✅ Project structure created
2. ✅ Dependencies configured
3. Continue with: **Logging Middleware Implementation**
4. Then: **Backend API Development**
5. Finally: **Frontend Components**

For detailed architecture, see [notification_system_design.md](./notification_system_design.md)

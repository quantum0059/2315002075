# Project Structure Overview

## Complete Folder Tree

```
Drive/                                    # Root monorepo
├── logging_middleware/                   # Reusable logging package
│   ├── src/
│   │   └── index.ts                      # Middleware implementation (placeholder)
│   ├── dist/                             # Compiled output (generated)
│   ├── package.json                      # Package definition
│   ├── tsconfig.json                     # TypeScript config (extends root)
│   ├── .eslintrc.json                    # ESLint config (extends root)
│   └── README.md                         # Package documentation
│
├── notification_app_be/                  # Express backend
│   ├── src/
│   │   └── index.ts                      # Server entry point (placeholder)
│   ├── dist/                             # Compiled output (generated)
│   ├── package.json                      # Package definition
│   ├── tsconfig.json                     # TypeScript config (extends root)
│   ├── .eslintrc.json                    # ESLint config (extends root)
│   ├── .env.example                      # Environment template
│   └── README.md                         # Backend documentation
│
├── notification_app_fe/                  # Next.js frontend
│   ├── src/
│   │   └── page.tsx                      # Page component (placeholder)
│   ├── public/                           # Static assets directory
│   ├── package.json                      # Package definition
│   ├── tsconfig.json                     # TypeScript config (Next.js extended)
│   ├── next.config.js                    # Next.js configuration
│   ├── .eslintrc.json                    # ESLint config (extends root)
│   ├── .env.example                      # Environment template
│   └── README.md                         # Frontend documentation
│
├── package.json                          # Root monorepo config with workspaces
├── tsconfig.json                         # Base TypeScript config
├── .eslintrc.json                        # Base ESLint config
├── .prettierrc.json                      # Prettier formatting config
├── .prettierignore                       # Prettier ignore patterns
├── .eslintignore                         # ESLint ignore patterns
├── .gitignore                            # Git ignore patterns
├── README.md                             # Root documentation
├── STRUCTURE.md                          # This file
└── notification_system_design.md         # Architecture and design doc
```

## File Statistics

- **Total Directories**: 6 (3 workspaces + node_modules-excluded)
- **Configuration Files**: 12
- **Documentation Files**: 5
- **Source Files**: 3 (placeholders)
- **Environment Templates**: 2

## Key Files Breakdown

### Root Configuration Files
| File | Purpose |
|------|---------|
| package.json | Monorepo workspace config |
| tsconfig.json | Base TypeScript configuration |
| .eslintrc.json | Base ESLint rules |
| .prettierrc.json | Code formatting rules |
| .gitignore | Git ignore patterns |
| .eslintignore | ESLint ignore patterns |
| .prettierignore | Prettier ignore patterns |

### Workspace-Level Files
| File | Purpose |
|------|---------|
| src/ | TypeScript source directory |
| dist/ | Compiled output (backend/middleware) |
| package.json | Workspace dependencies |
| tsconfig.json | Workspace TypeScript config |
| .eslintrc.json | Workspace ESLint rules |
| .env.example | Environment variable template |
| README.md | Component documentation |

## Development Directories (Generated at Runtime)

These directories are created during development and are in .gitignore:

```
node_modules/                  # Dependencies
dist/                          # Compiled TypeScript (backend/middleware)
.next/                         # Next.js build cache
coverage/                      # Test coverage reports
```

## Import Paths

### Monorepo Workspace Imports
```typescript
// In notification_app_be or notification_app_fe
import { loggingMiddleware } from '@notification/logging-middleware';
```

### Frontend Path Aliases
```typescript
// In notification_app_fe
import Component from '@/components/MyComponent';
import { helper } from '@/lib/helpers';
```

## Build Output Structure (After Compilation)

```
logging_middleware/dist/
├── index.js
├── index.d.ts
└── index.js.map

notification_app_be/dist/
├── index.js
├── index.d.ts
└── index.js.map
```

## Git Ignored Patterns

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
build/
.next/

# Environment
.env
.env.local

# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs & Coverage
logs/
coverage/
*.log
```

## Package Scope

- **@notification/logging-middleware** - Logging package
- **@notification/app-backend** - Backend service
- **@notification/app-frontend** - Frontend application

## Configuration Hierarchy

```
.eslintrc.json (root - base rules)
├── logging_middleware/.eslintrc.json (extends root)
├── notification_app_be/.eslintrc.json (extends root)
└── notification_app_fe/.eslintrc.json (extends root + React rules)

tsconfig.json (root - base config)
├── logging_middleware/tsconfig.json (extends root)
├── notification_app_be/tsconfig.json (extends root)
└── notification_app_fe/tsconfig.json (extends root + JSX config)
```

## Development Workflow

1. **Install**: `npm install` (installs all workspace dependencies)
2. **Develop**: `npm run dev` (runs both backend and frontend)
3. **Code**: Make changes in any workspace
4. **Format**: `npm run format` (formats all files)
5. **Lint**: `npm run lint` (checks all files)
6. **Build**: `npm run build` (builds all workspaces)
7. **Commit**: Git will ignore build artifacts and node_modules

## Next Steps After Skeleton

1. ✅ Project structure created
2. ✅ Configuration files generated
3. ⏳ Implement logging middleware
4. ⏳ Develop backend API endpoints
5. ⏳ Create frontend components
6. ⏳ Integrate frontend and backend
7. ⏳ Add tests
8. ⏳ Deploy


# Logging Middleware

Reusable, typed logging middleware package for Express applications.

## Purpose

Provides centralized logging functionality for:
- Request/response logging
- Error tracking
- Performance monitoring
- Debug information

## Package Info

- **Name**: `@notification/logging-middleware`
- **Type**: ESM/CommonJS hybrid
- **Peer Dependency**: Express 4.18+

## Structure

```
logging_middleware/
├── src/
│   └── index.ts          # Main middleware implementation
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

## Development

```bash
npm run build            # Compile TypeScript
npm run watch            # Watch mode
npm run lint             # Check code quality
```

## Usage (Example)

```typescript
import { loggingMiddleware } from '@notification/logging-middleware';
import express from 'express';

const app = express();
app.use(loggingMiddleware());
```

## Type Exports

All exports are fully typed with TypeScript.

## Configuration (To Be Implemented)

- Log level configuration (debug, info, warn, error)
- Custom formatters
- Output destinations

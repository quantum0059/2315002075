# Logging Middleware

Reusable, strongly typed logging package for frontend and backend applications.

## Purpose

This package exposes a single production-ready logger function:

- `Log(stack, level, packageName, message)`

Key features:

- TypeScript-first API
- Axios-based delivery
- Authentication token management
- Automatic token refresh
- Retry behavior for transient failures
- Strong validation for stack, level, and package name values
- Safe failure handling that preserves application flow

## Usage

```ts
import { Log, configureLogging, setAuthTokens } from '@notification/logging-middleware';

configureLogging({
  apiUrl: 'https://logging.example.com/v1/logs',
  refreshUrl: 'https://logging.example.com/v1/auth/refresh',
  timeoutMs: 5000,
  maxRetries: 2
});

setAuthTokens('initial-access-token', 'refresh-token');

await Log('backend', 'info', 'service', 'User import completed successfully.');
```

## Allowed values

- Stacks: `backend`, `frontend`
- Levels: `debug`, `info`, `warn`, `error`, `fatal`
- Backend package names: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
- Frontend package names: `api`, `component`, `hook`, `page`, `state`, `style`
- Shared package names: `auth`, `config`, `middleware`, `utils`

## Environment configuration

The package also reads default values from environment variables when available:

- `LOGGING_MIDDLEWARE_API_URL`
- `LOGGING_MIDDLEWARE_AUTH_TOKEN`
- `LOGGING_MIDDLEWARE_REFRESH_TOKEN`
- `LOGGING_MIDDLEWARE_REFRESH_URL`

## Development

```bash
npm run build
npm run watch
npm run lint
```

## Exports

- `Log` - primary logging API
- `configureLogging` - runtime configuration helper
- `setAuthTokens` - seed authentication values for log delivery

## Notes

If the configured logging endpoint is unavailable or token refresh fails, the package falls back to console diagnostics and never throws an exception that breaks application execution.

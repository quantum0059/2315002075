# Notification App - Backend

Express.js backend API server for the notification system.

## Purpose

Handles:
- API endpoints for notification management
- Business logic
- Database operations
- Authentication/Authorization
- Integration with logging middleware

## Server Info

- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Port**: 3001 (configurable)
- **Development Server**: tsx with file watch

## Structure

```
notification_app_be/
├── src/
│   ├── index.ts         # Server entry point
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   ├── types/           # TypeScript types
│   └── config/          # Configuration
├── dist/                # Compiled output
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── .env.example
```

## Development

```bash
npm run dev              # Start with file watch
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run lint             # Check code quality
npm run format           # Format code
```

## Environment Variables

See `.env.example` for template:
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging verbosity
- `PGHOST`: PostgreSQL host
- `PGPORT`: PostgreSQL port
- `PGUSER`: PostgreSQL user
- `PGPASSWORD`: PostgreSQL password
- `PGDATABASE`: PostgreSQL database name
- `PGPOOLSIZE`: Connection pool size for the Postgres client

## API Endpoints (To Be Implemented)

> Endpoints will be documented after implementation

## Dependencies

- **express**: Web framework
- **@notification/logging-middleware**: Centralized logging
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Dev Dependencies

- **tsx**: TypeScript runtime for development
- **@types/express**: Type definitions
- **@types/node**: Node.js type definitions
- **TypeScript**: Type checking

## Architecture Notes

- Uses logging middleware from workspace
- RESTful API design
- Structured error handling
- Modular route organization

## Type Safety

- Strict TypeScript configuration
- Express types with `@types/express`
- Interface-based architecture

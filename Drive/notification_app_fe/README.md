# Notification App - Frontend

Next.js 14 frontend application with React 18 and TypeScript.

## Purpose

Provides user interface for:
- Viewing notifications
- Managing notification preferences
- Real-time updates
- Responsive design

## Framework Info

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5.3
- **Port**: 3000 (default)
- **HTTP Client**: Axios

## Structure

```
notification_app_fe/
├── src/
│   ├── app/             # App Router pages & layouts
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript types
│   ├── services/        # API services
│   └── styles/          # CSS/styling
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── .eslintrc.json
└── .env.example
```

## Development

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm start                # Run production build
npm run lint             # Check code quality
npm run format           # Format code
npm run type-check       # Type checking
```

## Environment Variables

See `.env.example` for template:
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Key Features (To Be Implemented)

- Server-side rendering
- Static optimization
- Image optimization
- Built-in API routes
- Dynamic routes with App Router

## Dependencies

- **next**: Framework
- **react**: UI library
- **axios**: HTTP client
- **typescript**: Type checking

## Dev Dependencies

- **@types/react**: React type definitions
- **@types/node**: Node.js type definitions
- **eslint-config-next**: Next.js ESLint rules

## TypeScript Configuration

- **Strict mode** enabled
- **Path aliases**: `@/*` → `./src/*`
- **JSX preservation** for Next.js
- **Module bundling** optimized

## App Router Structure (To Be Implemented)

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── notifications/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── api/                 # API routes (if needed)
```

## API Integration

- Uses `NEXT_PUBLIC_API_URL` for backend communication
- Axios for HTTP requests
- Type-safe API calls
- Error handling

## Performance Optimization

- Code splitting (automatic)
- Image optimization (Next.js Image)
- Font optimization (Next.js Font)
- CSS-in-JS support

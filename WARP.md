# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**JoyTop Admin Panel** is a real estate admin dashboard built with Next.js 15, React 19, and TypeScript. This is a complete rewrite focusing on professional admin capabilities for API-managed real estate data with comprehensive reporting and multi-language support.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking without emit
npm run type-check
```

### Testing Individual Features
```bash
# Run development with specific focus areas
npm run dev  # Main dashboard at /admin
# Navigate to specific modules:
# - /admin/properties - Property management
# - /admin/users - User management
# - /admin/payments - Payment tracking
# - /admin/statistics - Analytics dashboard
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router + React 19 + TypeScript 5
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives + custom components
- **State Management**: Zustand for global state + React hooks for local state
- **Charts & Analytics**: Chart.js + react-chartjs-2
- **Internationalization**: i18next (Russian/Uzbek support)
- **Authentication**: Cookie-based JWT with persistent state

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Protected admin routes
│   │   ├── layout.tsx     # Admin layout with AuthGuard
│   │   ├── page.tsx       # Dashboard
│   │   ├── properties/    # Property management
│   │   ├── users/         # User management
│   │   ├── payments/      # Payment tracking
│   │   └── statistics/    # Analytics
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # UI components (organized by domain)
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard charts & metrics
│   ├── layout/            # Layout components (Header, Sidebar, Main)
│   ├── properties/        # Property management UI
│   ├── users/             # User management UI
│   ├── ui/                # Radix UI + custom base components
│   └── [domain]/          # Domain-specific components
├── lib/                   # Utilities and business logic
│   ├── api/               # API services (organized by domain)
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   └── i18n.ts           # Internationalization config
└── types/                 # TypeScript type definitions
    └── [entity].ts        # Domain-specific types
```

### Key Architectural Patterns

#### API Layer Architecture
- **Domain-driven structure**: Each API module (`lib/api/[domain].ts`) handles specific business domains
- **Consistent error handling**: All API calls use standardized error responses
- **Cookie-based authentication**: Uses `credentials: "include"` for automatic JWT handling
- **Multi-language headers**: API calls include language preference from localStorage

#### Component Organization
- **Domain separation**: Components grouped by business domain (properties, users, payments)
- **Single responsibility**: Max 150 lines per component, one purpose per component
- **Consistent patterns**: Loading states, error boundaries, empty states for all data displays
- **Modal-driven CRUD**: Create/Edit/Delete operations handled via modals

#### State Management Strategy
- **Local state**: React hooks for component-specific state
- **Global state**: Zustand stores for cross-component data (authentication, user preferences)
- **Data fetching**: Custom hooks (`lib/hooks/use[Entity].ts`) encapsulate API calls and state management
- **Persistence**: Zustand persist middleware for auth state (excluding tokens - stored in cookies)

#### Internationalization Implementation
- **i18next integration**: Full Russian/Uzbek translation support
- **Locale-driven API**: Backend API calls include language headers
- **Persistent language**: User language preference stored in localStorage
- **Component-level translations**: `useTranslation()` hook for all text content

### Critical Implementation Details

#### Authentication Flow
- Cookie-based JWT tokens (no client-side token storage)
- `AuthGuard` component protects admin routes
- Zustand store handles user state persistence
- `checkAuth()` method validates authentication on app init

#### Data Fetching Patterns
```typescript
// Standard hook pattern used throughout
export function useEntities(filters: Filters) {
  const [data, setData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API call with error handling
  // Loading/error state management
  // Return standardized interface
}
```

#### Component Structure Standards
```typescript
export function Component({ props }: ComponentProps) {
  // 1. Hooks first
  const { data, loading, error } = useHook();
  
  // 2. Early returns for states
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage />;
  
  // 3. Main render logic
  return (/* JSX */);
}
```

## Development Guidelines

### File Organization Principles
- **Maximum 150 lines per component** - Split larger components into smaller, focused pieces
- **Clear separation of concerns** - UI components separate from business logic
- **Consistent naming conventions** - PascalCase components, camelCase functions
- **TypeScript path aliases** - Use `@/` imports for clean import statements

### Code Quality Standards
- **Strict TypeScript** - No `any` types, proper interface definitions
- **Error handling everywhere** - Graceful degradation for all API failures
- **Responsive-first design** - Mobile-responsive with proper breakpoints
- **Accessibility compliance** - ARIA labels, keyboard navigation, focus states

### Performance Considerations
- **Component-level code splitting** - Lazy load non-critical components
- **React optimization hooks** - `memo`, `useMemo`, `useCallback` for expensive operations
- **Image optimization** - Next.js Image component for all images
- **Bundle size awareness** - Keep production builds under 500KB gzipped

### API Integration Notes
- **Base URL configuration**: Uses `NEXT_PUBLIC_API_URL` environment variable (defaults to `building.ardentsoft.uz`)
- **Authentication headers**: Cookies handled automatically, language headers added per request
- **Error response format**: Standardized error handling across all API endpoints
- **Pagination support**: Built-in pagination for list endpoints with proper loading states

This codebase follows a domain-driven architecture with clear separation between UI, business logic, and API integration layers. The authentication system uses secure cookie-based JWTs, and the entire application supports full internationalization for the target markets.
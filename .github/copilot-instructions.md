# FutaBusFE - Next.js Frontend Instructions

## Architecture Overview

FutaBusFE is a **Next.js 16 + React 19 + TypeScript** web application with:
- **App Router** (file-based routing in `app/` directory)
- **Tailwind CSS 4** for styling
- **Three user interfaces**: Admin, Employee, Client (each with separate layouts)
- **Feature-based organization** for business logic
- **Component-driven** architecture with reusable UI components
- **Dark mode support** with theme persistence
- **Authentication system** with JWT tokens and reusable login modal

## Project Structure

```
app/                       # Next.js App Router pages
├── admin/                 # Admin dashboard routes
│   ├── layout.tsx         # Admin layout with sidebar
│   ├── dashboard/         # Dashboard page
│   ├── customers/         # Customer management
│   └── [other-features]/  
├── employee/              # Employee portal routes
│   ├── layout.tsx         # Employee layout
│   └── [features]/
├── client/                # Public customer-facing routes
│   ├── layout.tsx         # Client layout with header
│   └── [features]/
└── layout.tsx             # Root layout (ThemeProvider)

feature/                   # Business logic by domain
├── booking/               # Booking logic
│   ├── api/               # API calls
│   ├── components/        # Booking components
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript types
├── trip/
├── route/
└── [other-features]/

src/
├── components/            # Shared UI components
│   ├── AdminHeader/
│   ├── AdminSidebar/
│   ├── ClientHeader/
│   ├── LoginModal/        # Reusable login modal
│   ├── Pagination/
│   └── TrackingMap/       # Real-time GPS tracking
└── context/
    ├── AuthContext.tsx    # Authentication state management
    └── ThemeContext.tsx   # Dark/light mode management

shared/
├── constants/
│   └── colors.ts          # Brand color palette
└── utils/                 # Utility functions
```

## Critical Patterns

### 1. Routing & Layouts
- **App Router**: Each folder in `app/` = route segment
- **Layouts**: Persist across navigation, wrap child pages
- **Role-based layouts**: Admin uses sidebar, Client uses header, Employee uses simplified header
- **Route structure**: `/admin/customers`, `/employee/tickets`, `/client/booking`

```tsx
// Admin layout (app/admin/layout.tsx)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}

// Page component (app/admin/dashboard/page.tsx)
export default function AdminDashboard() {
  return <div>Dashboard content</div>;
}
```

### 2. Component Organization
- **Shared components**: In `src/components/` with `.module.css` for styles
- **Feature components**: In `feature/[domain]/components/` (scoped to that feature)
- **Landing components**: In `src/components/Landing/` for homepage sections
- **Component structure**: `ComponentName.tsx` + `ComponentName.module.css` side-by-side
- **Naming**: PascalCase for components, camelCase for files in `feature/`
- **Component Reusability**: Always create reusable components when possible
  - Extract common UI patterns into separate components (e.g., `RouteCard`, `FeatureCard`)
  - Use props for customization instead of duplicating code
  - Document component props with TypeScript interfaces
  - Add TODO comments for future API integration

```tsx
// Reusable Card Component
interface RouteCardProps {
  title: string;
  duration: string;
  price: string;
  available: number;
}

export default function RouteCard({ title, duration, price, available }: RouteCardProps) {
  return <div className={styles.card}>...</div>;
}

// Usage in parent component
<RouteCard 
  title="Hà Nội - Đà Nẵng" 
  duration="14 giờ" 
  price="450.000đ" 
  available={12} 
/>
```

### 3. Feature-Based Architecture
- **Domain-driven**: Each feature (booking, trip, route) is self-contained
- **Subfolders**: `api/`, `components/`, `hooks/`, `types/` within each feature
- **API calls**: Centralized in `feature/[domain]/api/` (not in components)
- **Custom hooks**: Business logic reuse in `hooks/` (e.g., `useBooking`, `useTripData`)

```typescript
// feature/booking/api/index.ts
export const bookingApi = {
  previewBooking: async (tripId: number, seatIds: number[]) => {
    const res = await fetch(`${API_URL}/bookings/preview?tripId=${tripId}...`);
    return res.json();
  },
};

// feature/booking/hooks/useBooking.ts
export function useBooking(tripId: number) {
  const [loading, setLoading] = useState(false);
  // Custom logic here
}
```

### 4. Styling Approach
- **Tailwind CSS**: Primary styling method (utility classes)
- **CSS Modules**: For complex component-specific styles (`.module.css`)
- **Global styles**: `app/globals.css` for base styles
- **Dark mode**: Use `dark:` prefix for dark mode styles, controlled by ThemeContext
- **Brand Colors**: Always use constants from `shared/constants/colors.ts` for consistency

#### Brand Color Palette
```typescript
import { COLORS } from '@/shared/constants/colors';

// Primary colors (for CTAs, important actions)
COLORS.primary        // #D83E3E - Main brand red
COLORS.primaryDark    // #8B1A1A - Darker shade for hover states

// Secondary colors (for complementary elements)
COLORS.secondary      // #F5EFE1 - Light beige/cream
COLORS.secondaryDark  // #ECDDC0 - Darker beige

// Background
COLORS.background     // #EAEAEA - Main background color
```

**Usage Examples:**
```tsx
// With inline styles (CSS Modules)
<button style={{ backgroundColor: COLORS.primary }}>Click me</button>

// With Tailwind arbitrary values
<div className="bg-[#D83E3E] hover:bg-[#8B1A1A]">Content</div>

// With CSS Modules
import styles from './Component.module.css';
// In CSS: background-color: #D83E3E;

// CSS Modules
import styles from './Card.module.css';
<div className={styles.card}>...</div>
```

### 5. Theme Management
- **ThemeContext**: Wraps entire app in root layout
- **localStorage**: Persists theme preference
- **Hydration-safe**: Script in `<head>` prevents flash of unstyled content
- **Usage**: `useTheme()` hook in components

```tsx
// Using theme
import { useTheme } from '@/src/context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme === 'dark' ? '🌙' : '☀️'}</button>;
}
```

### 6. Authentication System
- **AuthContext**: Manages authentication state globally (wraps entire app)
- **JWT tokens**: Access token (24h) + refresh token (7d) stored in localStorage
- **Reusable LoginModal**: Component can be triggered from anywhere in the app
- **Protected routes**: Check `isAuthenticated` before rendering sensitive content
- **Role-based access**: User roles (ADMIN, USER, DRIVER, STAFF) for authorization

#### Authentication Flow
```typescript
// 1. Setup AuthProvider in root layout (already configured in app/layout.tsx)
import { AuthProvider } from '@/src/context/AuthContext';

// 2. Use auth in any component
import { useAuth } from '@/src/context/AuthContext';
import LoginModal from '@/src/components/LoginModal/LoginModal';

export default function MyComponent() {
  const { user, isAuthenticated, openLoginModal, isLoginModalOpen, closeLoginModal, logout } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={openLoginModal}>Login</button>
      )}
      
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
```

#### API Requests with Auth
```typescript
// Automatic token injection
const response = await fetch(`${API_BASE}/bookings`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Get token from useAuth()
  },
});

// Or use axios with interceptor (recommended)
import axios from 'axios';
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### Protected Route Pattern
```tsx
'use client';
import { useAuth } from '@/src/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated, user, openLoginModal } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal(); // Show login modal
      router.push('/'); // Or redirect to home
    } else if (user?.role.roleName !== 'ADMIN') {
      router.push('/unauthorized'); // Wrong role
    }
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated || user?.role.roleName !== 'ADMIN') {
    return null; // Or loading spinner
  }
  
  return <div>Admin content</div>;
}
```

### 7. TypeScript Conventions
- **Types**: Define in `feature/[domain]/types/` or inline for small components
- **Props**: Use `interface` for component props, `type` for unions/intersections
- **API responses**: Match backend `ApiResponse<T>` structure
- **Strict mode**: Enabled in `tsconfig.json`

```typescript
// feature/booking/types/index.ts
export interface BookingRequest {
  tripId: number;
  seatIds: number[];
  userId: string;
}

export interface BookingResponse {
  bookingId: string;
  totalAmount: number;
  seats: SeatInfo[];
}
```

### 8. API Integration
- **Backend URL**: `http://localhost:5230` (Spring Boot backend)
- **No `/api` prefix**: Routes are `/bookings`, `/trips` (not `/api/v1/trips`)
- **Authorization**: `Authorization: Bearer <token>` header
- **Response format**: `{ success: boolean, message: string, data: T }`
- **Axios**: Used for HTTP requests (configured in feature API files)

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:5230';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Key Features

### Real-Time Seat Locking (WebSocket)
- Uses `@stomp/stompjs` + `sockjs-client`
- Connect to `ws://localhost:5230/ws`
- Subscribe: `/topic/seats/{tripId}` for seat updates
- Implementation in booking flow components

### Multi-Role Dashboards
- **Admin**: Full system access (users, vehicles, routes, reports)
- **Employee**: Trip management, ticketing, driver assignment
- **Client**: Browse routes, book tickets, view bookings

### Component Reusability
- `AdminHeader`, `ClientHeader`, `EmployeeHeader` - role-specific headers
- `AdminSidebar` - navigation for admin features
- `Pagination` - reusable pagination controls
- `TrackingMap` - Leaflet-based GPS tracking (React Leaflet)

## Development Workflow

### Running the App
```bash
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

### Environment Variables
- Create `.env.local` for API URLs, keys (not committed)
- Access: `process.env.NEXT_PUBLIC_API_URL`

### File Naming
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Components**: `ComponentName.tsx`
- **Styles**: `ComponentName.module.css` or inline Tailwind
- **Placeholder**: `.gitkeep` for empty folders

## Common Pitfalls

1. **Client vs. Server Components**: Mark client components with `'use client'` if using hooks/state
2. **Layout hierarchy**: Layouts wrap child layouts and pages (nested structure)
3. **CSS Modules naming**: Use `.module.css` suffix for scoped styles
4. **Dark mode flash**: Theme script in `<head>` must run before body renders
5. **API calls in components**: Move to feature API files, not inline in components
6. **Route conflicts**: Don't create `/client/dashboard` if `/admin/dashboard` exists (namespace by role)
7. **Image optimization**: Use `next/image` for all images (auto-optimization)
8. **Metadata**: Export `metadata` object in pages for SEO

## Integration Points

- **Backend API**: FubaBusBE at `localhost:5230`
- **WebSocket**: Real-time seat updates during booking
- **Mobile App**: Shared API endpoints with fuba-mobile (Expo app)
- **External Libraries**:
  - `react-leaflet` - Map tracking
  - `recharts` - Dashboard charts
  - `react-hook-form` - Form validation
  - `react-icons` - Icon library

## Reference Files

- `app/layout.tsx` - Root layout with AuthProvider + ThemeProvider
- `app/admin/layout.tsx` - Complex nested layout example
- `src/components/AdminSidebar/` - Navigation component pattern
- `src/components/LoginModal/` - Reusable modal component with auth integration
- `src/context/AuthContext.tsx` - Authentication state management pattern
- `src/context/ThemeContext.tsx` - Theme context pattern
- `shared/constants/colors.ts` - Brand color palette constants

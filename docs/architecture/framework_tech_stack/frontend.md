# Frontend Architecture

## Overview
LilaDot's frontend is built with modern web technologies to ensure a responsive, accessible, and maintainable user interface.

## Core Technologies

### 1. Framework
- **React 18+**
  - Functional components with hooks
  - Context API for state management
  - Concurrent features for better performance

### 2. Styling
- **Tailwind CSS**
  - Utility-first CSS framework
  - Custom theme configuration
  - Dark/light mode support
  - Responsive design patterns

### 3. UI Components
- **Headless UI**
  - Unstyled, accessible UI components
  - Customizable design system
  - Keyboard navigation support

## Architecture

### Component Structure
```
components/
├── common/         # Reusable UI components
├── meeting/        # Meeting-specific components
├── settings/       # Settings page components
├── transcription/  # Transcription view components
└── layout/         # Layout components
```

### State Management
- **React Context**
  - Global application state
  - Theme preferences
  - User settings
  - Authentication state

- **Local State**
  - Component-level state with `useState`
  - Derived state with `useMemo`
  - Side effects with `useEffect`

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy dependencies

### Bundle Optimization
- Tree shaking
- Module concatenation
- Asset compression

## Accessibility
- WCAG 2.1 AA compliance
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Reduced motion preferences

## Internationalization
- i18n support
- RTL language support
- Locale-aware formatting

## Development Tools
- ESLint for code quality
- Prettier for code formatting
- Storybook for component development
- React DevTools for debugging

## Testing Strategy
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress
- Visual regression testing

## Build & Deployment
- Vite for development server and builds
- Environment-based configuration
- Source maps for production
- Asset hashing for cache busting

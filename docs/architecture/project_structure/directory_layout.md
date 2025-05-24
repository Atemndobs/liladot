# Project Directory Structure (Plasmo-based)

## Root Level
```
.
├── .github/               # GitHub workflows and issue templates
├── .vscode/               # VS Code settings and extensions
├── .plasmo/              # Plasmo build cache (ignored in git)
├── build/                # Compiled output (ignored in git)
├── docs/                 # Project documentation
│   └── architecture/     # Architecture decision records and specs
├── node_modules/         # Dependencies (ignored in git)
├── public/               # Static assets
├── src/                  # Source code following Plasmo conventions
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── background/       # Background service worker
│   ├── contents/         # Content scripts
│   ├── popup/            # Popup UI components
│   ├── options/          # Options page components
│   ├── components/       # Shared React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Shared utilities and libraries
│   ├── services/         # API and service integrations
│   ├── stores/           # State management (Zustand/Recoil)
│   └── styles/           # Global styles and themes
├── test/                 # Test files
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore rules
├── .prettierrc         # Prettier configuration
├── package.json         # Project metadata and scripts
├── plasmo.config.ts     # Plasmo configuration
├── README.md           # Project documentation
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Key Directories Explained (Plasmo-specific)

### `src/background/`
- `index.ts` - Service worker entry point (Plasmo auto-generates the service worker)
- `handlers/` - Message and event handlers
- `services/` - Background services (audio, storage, etc.)

### `src/contents/` (Plasmo convention for content scripts)
- `meet/` - Google Meet integration
- `teams/` - Microsoft Teams integration
- `zoom/` - Zoom Web integration
- `common/` - Shared content script utilities

### `src/popup/`
- `components/` - Popup-specific components
- `index.tsx` - Popup entry point (Plasmo handles the routing)

### `src/options/`
- `components/` - Options page components
- `index.tsx` - Options page entry point

### `src/components/`
- `common/` - Reusable UI components
- `meeting/` - Meeting-specific components
- `settings/` - Settings page components
- `transcription/` - Transcription-related components
- `ui/` - Base UI components (using @plasmo-corp/design-system or similar)

### `src/services/`
- `api/` - API clients
- `audio/` - Audio processing
- `storage/` - Data persistence
- `transcription/` - Transcription service integration

## Naming Conventions

### Files
- Use `kebab-case` for file names
- Use `.tsx` for React components
- Use `.ts` for non-React TypeScript files
- Use `.test.ts` or `.test.tsx` for test files

### Components
- Use `PascalCase` for component files
- One component per file
- Suffix higher-order components with `.hoc.ts`

### Types
- Use `PascalCase` for type names
- Suffix type definitions with `.types.ts`
- Use `I` prefix for interfaces (optional)

## Environment Variables

### Development (`.env.development`)
```env
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000
VITE_DEBUG=true
```

### Production (`.env.production`)
```env
NODE_ENV=production
VITE_API_BASE_URL=https://api.liladot.com
VITE_DEBUG=false
```

## Build Artifacts
- `dist/` - Compiled extension bundle
  - `assets/` - Compiled assets
  - `manifest.json` - Processed manifest
  - `*.js` - Compiled JavaScript bundles
  - `*.css` - Compiled CSS files

## Testing Structure
```
test/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test fixtures and mocks
```

## Documentation
```
docs/
├── architecture/   # Architecture documentation
├── api/           # API documentation
├── guides/        # How-to guides
└── images/        # Documentation images
```

## Best Practices
1. Keep components small and focused
2. Follow the single responsibility principle
3. Use absolute imports for better maintainability
4. Document complex logic with JSDoc
5. Write tests for critical paths
6. Maintain a consistent folder structure
7. Keep business logic separate from UI components
8. Use environment variables for configuration
9. Follow semantic versioning for releases
10. Document architectural decisions

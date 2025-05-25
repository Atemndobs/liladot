# LilaDot - Meeting Notes & Transcription Platform

LilaDot is a comprehensive solution for capturing, transcribing, and managing meeting notes across various video conferencing platforms.

## Monorepo Structure

```text
liladot/
├── web/                # Web application (React, Vite, Tailwind CSS)
├── packages/           # Shared packages (TBD)
└── src/                # Chrome extension source (Plasmo)
```

## Features

### Chrome Extension

- 🎙️ Record meeting audio from Google Meet, Zoom, and Microsoft Teams
- 📝 Automatic transcription
- 🔍 Search through past meetings
- 🎨 Clean, user-friendly interface

### Web Application

- 📂 Organize and manage meeting notes
- 🔒 Secure user authentication
- 🚀 Modern, responsive interface
- 🔄 Sync with Chrome extension

## Tech Stack

### Shared

- **Language**: TypeScript
- **UI**: React 18, Tailwind CSS
- **Linting**: ESLint + Prettier

### Chrome Extension

- **Framework**: [Plasmo](https://docs.plasmo.com/)
- **Build**: Vite
- **State Management**: Zustand

### Web Application

- **Framework**: React 18
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Auth**: Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Chrome or any Chromium-based browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/liladot.git
   cd liladot
   ```

2. Install root dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Install web app dependencies:

   ```bash
   cd web
   npm install
   # or
   yarn
   cd ..
   ```

## Development

### Chrome Extension

```bash
# Start development server
npm run extension:dev

# Build for production
npm run extension:build
```

### Web Application

```bash
# Start development server
npm run web:dev

# Build for production
npm run web:build

# Preview production build
npm run web:preview
```

## Environment Variables

Create the following files and add the appropriate environment variables:

### Root `.env`

```bash
# Add any shared environment variables here
```

### Web App (web/.env.development)

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` directory
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `build/chrome-mv3-dev` directory

## Development

### Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── background/       # Background service worker
├── components/       # Reusable React components
│   ├── common/       # Common UI components
│   ├── meeting/      # Meeting-specific components
│   ├── settings/     # Settings page components
│   └── ui/           # Base UI components
├── contents/         # Content scripts
├── hooks/            # Custom React hooks
├── lib/              # Shared utilities
├── services/         # API and service integrations
├── stores/           # State management
├── styles/           # Global styles and themes
└── types/            # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:watch` - Build in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Plasmo](https://docs.plasmo.com/) for the amazing Chrome extension framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the component-based UI library

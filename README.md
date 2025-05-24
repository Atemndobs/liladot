# LilaDot - Meeting Notes & Transcription Chrome Extension

LilaDot is a Chrome extension that helps you capture and transcribe meeting notes from various video conferencing platforms including Google Meet, Zoom, and Microsoft Teams.

## Features

- 🎙️ Record meeting audio
- 📝 Automatic transcription
- 📂 Save and organize notes
- 🔍 Search through past meetings
- 🎨 Clean, user-friendly interface
- 🔒 Privacy-focused (all processing happens locally)

## Tech Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/) (Chrome Extension Framework)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

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

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
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

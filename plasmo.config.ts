import { defineConfig } from 'plasmo';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  manifest: {
    name: 'LilaDot',
    description: 'A Chrome extension for meeting transcription and note-taking',
    version: '0.1.0',
    permissions: ['activeTab', 'storage', 'tabs', 'tabCapture', 'scripting'],
    host_permissions: [
      'https://meet.google.com/*',
      'https://zoom.us/*',
      'https://teams.microsoft.com/*',
    ],
  },
  build: {
    // Output directory for the built extension
    outDir: 'dist',
    // Enable source maps for development
    sourcemap: process.env.NODE_ENV === 'development',
  },
  // Configure the development server
  dev: {
    // Enable HMR (Hot Module Replacement)
    hmr: true,
    // Open the extension in Chrome when starting the dev server
    open: true,
  },
  // Configure CSS processing
  css: {
    postcss: {
      plugins: [tailwindcss, require('autoprefixer')],
    },
  },
  // Configure TypeScript
  typescript: {
    // Enable strict type checking
    strict: true,
  },
});

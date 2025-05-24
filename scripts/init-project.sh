#!/bin/bash

# Initialize a new Plasmo project
echo "🚀 Initializing new Plasmo project..."
npm create plasmo@latest . -- --template=react-typescript

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install -D tailwindcss postcss autoprefixer @types/chrome @types/node @types/react @types/react-dom @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom eslint-plugin-testing-library

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create necessary directories
echo "📂 Creating project structure..."
mkdir -p src/{assets,components/{common,meeting,settings,transcription,ui},hooks,lib,services,stores,styles,types,utils}

# Create initial files
echo "📝 Creating initial files..."

# Create Tailwind config
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@plasmohq/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Create global CSS
cat > src/styles/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
EOL

echo "✅ Project initialization complete!"
echo "Next steps:"
echo "1. Update package.json with project details"
echo "2. Configure ESLint and Prettier"
echo "3. Start development server with: npm run dev"

# Make the script executable
chmod +x scripts/init-project.sh

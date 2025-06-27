# URL Shortener

A modern URL shortening service built with React, TypeScript, Vite, and Material UI. This application allows users to create shortened URLs, track click statistics, and manage their shortened links with expiration times.

## Features

- 🔗 Create shortened URLs with custom codes
- ⏱️ Set expiration times for links
- 📊 Track click statistics
- 📱 Responsive Material UI design
- 🔄 Real-time status updates
- 📋 Easy copy-to-clipboard functionality

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI v5
- Supabase (for backend)
- React Router v6

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaviTwari03/URL-Shortener.git
   cd URL-Shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=https://irrtdgaaggawkscfcqec.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycnRkZ2FhZ2dhd2tzY2ZjcWVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTAxMjA5MiwiZXhwIjoyMDY2NTg4MDkyfQ.0tWKdvPksyxr1oZeSUpwJBj3bWNJbVGMPdqbzf_q8u8
     ```



5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in VSCode**
   ```bash
   code .
   ```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Project Structure

```
URL-Shortener/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities and configurations
│   ├── theme.ts      # Material UI theme configuration
│   └── App.tsx       # Main application component
├── public/           # Static assets
└── index.html        # Entry HTML file
```

## Development in VSCode

Recommended VSCode extensions:
- ESLint
- Prettier
- TypeScript + JavaScript
- Material UI Snippets
- GitLens

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Ravi Tiwari - [@RaviTwari03](https://github.com/RaviTwari03)

Project Link: [https://github.com/RaviTwari03/URL-Shortener](https://github.com/RaviTwari03/URL-Shortener)

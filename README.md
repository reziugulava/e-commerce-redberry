# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# E-commerce Redberry 🛒

A modern, full-featured e-commerce web application built with React, TypeScript, and cutting-edge web technologies. This project implements a complete online shopping experience with authentication, product browsing, cart management, and checkout functionality.

## ✨ Features

- **🔐 Authentication System**: Secure user registration and login
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🛍️ Product Catalog**: Browse products with advanced filtering and search
- **🛒 Shopping Cart**: Add, remove, and manage cart items
- **💳 Checkout Process**: Complete purchase flow with order management
- **🎨 Modern UI**: Built with shadcn/ui components and Radix UI primitives
- **⚡ Performance**: Optimized with TanStack Query for data fetching and caching
- **🔄 State Management**: Zustand for global state management
- **📝 Form Validation**: React Hook Form with Zod schema validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **React Router DOM v7** - Client-side routing

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible React components
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Beautiful SVG icons

### State Management & Data
- **TanStack Query v5** - Server state management and caching
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗️ Project Structure

```
src/
├── app/                    # Application configuration
│   ├── providers.tsx       # App providers (Query, Auth, etc.)
│   ├── router.tsx          # Route definitions
│   └── routes/             # Page components
│       ├── auth/           # Authentication pages
│       ├── cart/           # Cart page
│       ├── checkout/       # Checkout flow
│       ├── home/           # Home page
│       └── products/       # Product pages
│
├── components/             # Shared UI components
│   ├── navigation/         # Navigation components
│   └── ui/                 # shadcn/ui components
│
├── features/               # Feature-based modules
│   ├── auth/               # Authentication feature
│   │   ├── api/            # Auth API calls
│   │   ├── components/     # Auth components
│   │   ├── hooks/          # Auth hooks
│   │   ├── stores/         # Auth state
│   │   └── types/          # Auth types
│   │
│   ├── cart/               # Shopping cart feature
│   │   ├── components/     # Cart components
│   │   ├── context/        # Cart context
│   │   ├── hooks/          # Cart hooks
│   │   └── types/          # Cart types
│   │
│   ├── checkout/           # Checkout feature
│   └── products/           # Product management
│
├── lib/                    # Shared utilities
│   ├── api/                # API configuration
│   └── utils.ts            # Common utilities
│
└── assets/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reziugulava/e-commerce-redberry.git
   cd e-commerce-redberry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=E-commerce Redberry
```

### shadcn/ui Components

This project uses shadcn/ui with the following configuration:
- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Icon Library**: Lucide React

To add new components:
```bash
npx shadcn@latest add [component-name]
```

## 🏛️ Architecture

This project follows the **feature-based architecture** pattern inspired by Bulletproof React:

- **Feature Isolation**: Each feature (auth, cart, products) is self-contained
- **Clear Boundaries**: APIs, components, hooks, and types are organized by feature
- **Shared Resources**: Common UI components and utilities are shared across features
- **Type Safety**: Full TypeScript coverage with strict type checking

## 🔐 Authentication Flow

1. User registration/login through secure forms
2. JWT token management with automatic refresh
3. Protected routes with authentication guards
4. User profile management

## 🛒 Cart Management

- Persistent cart state with local storage
- Real-time cart updates across components
- Cart sidebar with quick access
- Quantity management and item removal

## 📱 Responsive Design

- Mobile-first design approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🧪 Code Quality

- **ESLint**: Comprehensive linting rules for React and TypeScript
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Import Organization**: Automatic import sorting

## 📦 Build & Deployment

The project builds to static files that can be deployed anywhere:

```bash
npm run build
```

Build output is optimized and includes:
- Code splitting for optimal loading
- Asset optimization
- Tree shaking for minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the excellent utility framework
- [TanStack Query](https://tanstack.com/query) for powerful data synchronization
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives

---

Built with ❤️ by [Redberry](https://github.com/reziugulava)

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

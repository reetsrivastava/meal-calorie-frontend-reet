# CaloWise 🥗

**Your smart meal calorie counter for healthier living**

CaloWise is a modern web application that helps you track and calculate the calorie content of your meals. Built with Next.js, it provides a seamless user experience with authentication, meal history tracking, and real-time calorie calculations.

## 🌐 Live Demo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://calowise.vercel.app/)

**🔗 [View Live Application →](https://calowise.vercel.app/)**

Visit the deployed application at [https://calowise.vercel.app/](https://calowise.vercel.app/) to see CaloWise in action!

## 📸 Screenshots

Screenshot 2025-11-15 at 12.12.19 PM.png
Screenshot 2025-11-15 at 12.12.08 PM.png
Screenshot 2025-11-15 at 12.12.00 PM.png
Screenshot 2025-11-15 at 12.11.22 PM.png
Screenshot 2025-11-15 at 12.11.08 PM.png
Screenshot 2025-11-15 at 12.10.45 PM.png
Screenshot 2025-11-15 at 12.10.38 PM.png
Screenshot 2025-11-15 at 12.10.27 PM.png

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT token management
- 📊 **Calorie Calculator** - Calculate calories for any dish with serving size support
- 📝 **Meal History** - Track and view your past calorie calculations
- 🎨 **Modern UI** - Beautiful, responsive design built with Shadcn UI and Tailwind CSS
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 🔔 **Toast Notifications** - Real-time feedback for all operations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Form Validation** - Comprehensive client-side validation with Zod
- 🧪 **Testing** - Component tests with Vitest and React Testing Library

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)

### Testing
- **Test Framework**: [Vitest](https://vitest.dev/)
- **Testing Library**: [React Testing Library](https://testing-library.com/react/)
- **Test Environment**: [jsdom](https://github.com/jsdom/jsdom)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun
- Backend API endpoint (see Environment Variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-calorie-frontend-reet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
meal-calorie-frontend-reet/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes (proxy)
│   ├── calories/             # Calories result page
│   ├── dashboard/            # Dashboard with calorie calculator
│   │   └── __tests__/        # Dashboard tests
│   ├── history/              # Meal history page
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # Shadcn UI components
│   ├── auth-protected.tsx    # Route protection wrapper
│   ├── header.tsx            # App header/navigation
│   └── theme-provider.tsx    # Theme context provider
├── lib/                      # Utility libraries
│   ├── api/                  # API client
│   ├── schemas/              # Zod validation schemas
│   ├── stores/               # Zustand state stores
│   └── utils/                # Helper functions
├── public/                   # Static assets
├── vitest.config.ts          # Vitest configuration
├── vitest.setup.ts           # Test setup file
└── package.json              # Dependencies and scripts
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## 🔌 API Integration

The application communicates with a backend API. The following endpoints are used:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Calories
- `POST /get-calories` - Calculate calories for a dish
  - Requires: JWT token in Authorization header
  - Body: `{ dish_name: string, servings: number }`

### CORS Handling

The app uses a Next.js API proxy route (`/api/proxy/[...path]`) to handle CORS issues when making requests from the browser. This proxy forwards requests to the backend API server-side, avoiding browser CORS restrictions.

## 🧪 Testing

Tests are written using Vitest and React Testing Library. Run tests with:

```bash
npm run test
```

View test coverage:

```bash
npm run test:coverage
```

Example test file: `app/dashboard/__tests__/page.test.tsx`

## 🎨 UI Components

The project uses Shadcn UI components, which are customizable and accessible:

- Button
- Input
- Form (with React Hook Form integration)
- Label
- Toast (notifications)
- Alert
- Loader
- Avatar
- Dropdown Menu

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is stored in Zustand store (persisted to localStorage)
3. Token is automatically included in API requests via `apiClient`
4. Protected routes check for token and redirect to login if missing
5. Token is cleared on logout

## 📊 State Management

- **Auth State** (`lib/stores/auth.ts`) - Manages authentication token and user info
- **History State** (`lib/stores/history.ts`) - Manages meal calculation history

Both stores use Zustand with persistence to localStorage.

## 🌓 Theme Support

The app supports dark and light themes with system preference detection. Users can toggle themes using the theme switcher in the header.

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Make sure to set the following environment variables in your deployment platform:

- `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL

## 📝 Form Validation

All forms use Zod schemas for validation:

- **User Registration**: Email, password strength, name validation
- **Login**: Email and password validation
- **Calorie Calculator**: Dish name format, servings range (0.1-1000)

## 🔔 Notifications

Toast notifications are used throughout the app for:
- Success messages (login, registration, calorie calculation)
- Error messages (API errors, validation errors)
- Info messages

## 👤 Author

Built with ❤️ for healthier living by Reet Srivastava

---

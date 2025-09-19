# Sweet Shop Management System

A comprehensive full-stack web application for managing a sweet shop inventory, built with React.js frontend and Node.js/Express backend, following Test-Driven Development (TDD) principles.

## 🍭 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Sweet Inventory Management**: Complete CRUD operations for sweet products
- **Search & Filtering**: Advanced search by name, category, and price range
- **Purchase System**: Real-time inventory tracking with purchase functionality
- **Admin Panel**: Administrative features for inventory management and restocking
- **Responsive Design**: Mobile-first design that works on all devices

### User Roles
- **Customer**: Browse, search, and purchase sweets
- **Admin**: Full inventory management, restocking, and administrative controls

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/sweets` - Retrieve all sweets with pagination and filters
- `GET /api/sweets/search` - Advanced search functionality
- `POST /api/sweets` - Add new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet details (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase sweet (decreases inventory)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## 🌐 Deployment


2. **Environment Variables**: Set the following :
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
3. **Deploy**: Vercel will automatically build and deploy your application
4. **API Routes**: The backend will be available at `/api/*` endpoints

### Local Development

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```



2. **Run the application**:
   ```bash
   npm run dev
   ```
   This starts both the frontend (port 5173) and backend (port 3001) concurrently.

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Demo Accounts
- **Admin**: admin@sweetshop.com / admin123
- **Customer**: customer@example.com / customer123

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:run
```

### Test-Driven Development
This project follows TDD principles with comprehensive test coverage including:
- Unit tests for API endpoints
- Integration tests for database operations
- Frontend component tests
- End-to-end workflow testing

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: express-validator for request validation
- **Security**: Helmet, CORS, and Row Level Security (RLS)

### Frontend (React.js)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and Context API
- **Icons**: Lucide React
- **Build Tool**: Vite

### Database Schema
- **users**: User accounts with role-based access
- **sweets**: Product inventory with categories and pricing
- Row Level Security policies for data protection



### Components
- Reusable UI components with consistent styling
- Accessibility-first design principles
- Smooth animations and micro-interactions
- Mobile-responsive layouts with proper breakpoints

## 🔧 Development Scripts

```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run test suite
npm run test:ui      # Run tests with UI
```

## 📁 Project Structure

```
├── server/                 # Backend application
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   ├── config/            # Database and configuration
│   ├── middleware/        # Custom middleware (auth, etc.)
│   ├── routes/            # API route handlers
│   
├── src/                   # Frontend application
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── test/             # Frontend tests
├── supabase/             # Database migrations and config
└── public/               # Static assets
```

## 🔒 Security Features

- **Authentication**: Secure JWT implementation with HTTP-only considerations
- **Password Security**: bcrypt hashing with salt rounds
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Protection**: Helmet.js security headers
- **CORS**: Configured for secure cross-origin requests
- **Row Level Security**: Database-level access control
- **Input Validation**: Comprehensive server-side validation

## 🎯 Key Features Demonstration

### Customer Experience
1. **Browse Products**: View all available sweets with rich product information
2. **Search & Filter**: Find specific sweets by name, category, or price range
3. **Purchase Flow**: Select quantity and complete purchase with real-time inventory updates
4. **Responsive Design**: Seamless experience across desktop, tablet, and mobile

### Admin Experience
1. **Inventory Management**: Add, edit, and delete sweet products
2. **Stock Control**: Restock items and monitor inventory levels
3. **Analytics**: View product performance and stock status
4. **User Management**: Role-based access control

## 🔄 API Integration

The application uses a custom API service layer (`src/services/api.ts`) that provides:
- Centralized error handling
- Automatic token management
- Type-safe request/response handling
- Consistent HTTP status code handling

## 🌐 Deployment Ready

The application is production-ready with:
- Environment-based configuration
- Build optimization
- Security best practices
- Scalable architecture
- Comprehensive error handling

## My AI Usage
Throughout the development of this Sweet Shop Management System, I used several AI tools to speed up routine work, brainstorm solutions, and improve the UI while ensuring I reviewed and validated all generated output.

### AI Tools Used
- **bolt.new** — used to scaffold the initial project boilerplate and file structure
- **Claude (Claud AI)** — used primarily for backend API design and initial Express/TypeScript handler suggestions
- **GitHub Copilot** — used during development for inline code suggestions and debugging assistance
- **ChatGPT** — used for UI/UX suggestions, wording, and component-level improvements

### How I Used These Tools

- **Boilerplate & Project Scaffolding (bolt.new)**
   - Generated the initial project skeleton and common configuration files so I could start implementing features faster.

- **Backend API Design & Implementation (Claude / Claud AI)**
   - Brainstormed REST endpoint structures, database schema ideas, and initial route handler code.
   - Used its suggestions as a starting point, then adapted them to the project’s TypeScript + Supabase setup.

- **Debugging & Code Suggestions (GitHub Copilot)**
   - Accepted and adapted inline completions for helper utilities, small functions, and refactorings.
   - Used Copilot’s suggestions to speed up debugging iterations, but verified correctness manually and with tests.

- **UI / UX & Copy (ChatGPT)**
   - Asked ChatGPT for component layout suggestions, accessible markup patterns, and copy/label improvements for form fields and buttons.
   - Implemented and iterated on ChatGPT’s suggestions to improve usability and clarity.

### Reflection on AI’s Impact

**What helped:**
- Rapid scaffolding saved time at project start.
- Backend brainstorming helped shape the API quickly and avoid early design mistakes.
- Copilot accelerated small refactors and iterative debugging.
- ChatGPT helped improve UI clarity and accessibility decisions.

**What I had to guard against:**
- I reviewed every suggestion and test-covered the critical paths; I did not copy-paste blindly.
- AI-suggested code often needed tailoring to match the project’s TypeScript types, security expectations, and Supabase patterns.

**Overall:** AI was a valuable productivity partner for routine tasks and ideation. It reduced boilerplate time and suggested useful alternatives, but the final responsibility for correctness, security, and maintainability remained with me.


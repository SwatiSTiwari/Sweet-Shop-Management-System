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

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set the following in Vercel dashboard:
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

2. **Set up Supabase**:
   - Click the "Connect to Supabase" button in the top right
   - Follow the setup instructions to connect your Supabase project
   - The environment variables will be automatically configured

3. **Run the application**:
   ```bash
   npm run dev
   ```
   This starts both the frontend (port 5173) and backend (port 3001) concurrently.

4. **Access the application**:
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

## 📱 Design System

### Color Palette
- **Primary**: Orange (#F97316) - Warm, inviting brand color
- **Secondary**: Pink (#EC4899) - Playful accent color
- **Success**: Green (#10B981) - Positive actions and status
- **Warning/Error**: Standard red tones for alerts
- **Neutral**: Comprehensive gray scale for typography and backgrounds

### Typography
- Clean, readable fonts with proper hierarchy
- Responsive text sizing
- Consistent line heights (150% body, 120% headings)

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
│   └── __tests__/         # Backend tests
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

Throughout the development of this Sweet Shop Management System, I leveraged AI tools to enhance productivity and code quality while maintaining full understanding and control of the implementation.

### AI Tools Used
- **Claude Sonnet 4**: Primary AI assistant for code generation, architecture planning, and problem-solving
- **Integrated AI Coding**: Used for boilerplate generation, test writing, and debugging assistance

### How AI Was Used

#### Architecture & Planning
- **API Design**: Used AI to brainstorm RESTful endpoint structures and validate API design patterns
- **Database Schema**: Collaborated with AI to design normalized database tables with proper relationships and constraints
- **Security Considerations**: Consulted AI for security best practices, including JWT implementation and RLS policies

#### Code Generation
- **Boilerplate Creation**: AI generated initial component structures, Express route handlers, and TypeScript interfaces
- **Form Validation**: AI helped create comprehensive validation schemas for both frontend and backend
- **Error Handling**: AI assisted in implementing consistent error handling patterns across the application

#### Testing Strategy
- **Test Cases**: AI helped identify edge cases and generate comprehensive test scenarios
- **Mock Data**: AI generated realistic test data and sample sweet products for development and testing
- **Test Structure**: AI provided guidance on TDD implementation and testing best practices

#### UI/UX Enhancement
- **Component Design**: AI suggested modern UI patterns and accessibility improvements
- **Responsive Layouts**: AI helped implement mobile-first responsive design principles
- **Animation Details**: AI provided CSS animation suggestions for micro-interactions

### My Reflection on AI Impact

**Positive Impacts:**
1. **Accelerated Development**: AI significantly reduced time spent on boilerplate code and repetitive tasks
2. **Best Practices**: AI helped ensure I followed industry standards for security, testing, and code organization
3. **Problem Solving**: When encountering complex issues, AI provided multiple solution approaches to consider
4. **Documentation**: AI assisted in creating comprehensive documentation and code comments

**Learning Enhancement:**
1. **Pattern Recognition**: Working with AI helped me identify common patterns in full-stack development
2. **Code Quality**: AI suggestions often highlighted opportunities for cleaner, more maintainable code
3. **Testing Mindset**: AI reinforced the importance of comprehensive testing and TDD methodology

**Challenges & Considerations:**
1. **Code Understanding**: I ensured I understood every piece of AI-generated code before integration
2. **Customization Needs**: AI-generated code required customization to fit specific project requirements
3. **Validation Required**: All AI suggestions were tested and validated before implementation

### Workflow Integration

My typical workflow with AI assistance:
1. **Planning**: Discuss architecture and approach with AI
2. **Implementation**: Use AI for boilerplate, then customize and refine
3. **Testing**: Collaborate with AI on test case development
4. **Review**: Validate all AI-generated code through testing and manual review
5. **Documentation**: Work with AI to create comprehensive documentation

This project demonstrates how AI can be effectively used as a development partner while maintaining code quality, understanding, and personal responsibility for the final implementation.

## 📄 License

This project is created for educational and demonstration purposes as part of a technical assessment.

---

Built with ❤️ using modern web technologies and Test-Driven Development principles.
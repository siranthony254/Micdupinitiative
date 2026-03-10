# MUI Portal - Production Ready Learning Platform

A modern, production-ready learning and cohort management platform built with Next.js 16, Supabase, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Authentication**: Email/password signup/signin with Supabase Auth
- **User Profiles**: Complete user management with roles (student/admin)
- **Courses System**: Self-paced learning with progress tracking
- **Cohort System**: Secret key access for group learning
- **Progress Tracking**: Real-time progress bars and completion tracking
- **Admin Dashboard**: Full admin capabilities for content management

### Technical Features
- **Modern Stack**: Next.js 16, TypeScript, Supabase, Tailwind CSS
- **Production Ready**: Proper error handling, loading states, security
- **Responsive Design**: Mobile-first, dark theme, modern UI
- **Database Design**: Optimized schema with RLS and triggers
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database and auth)

## 🛠️ Setup Instructions

### 1. Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy and paste the entire contents of `schema.sql`
   - Run the script to create all tables, triggers, and sample data

3. **Configure Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Project Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to `/mui-portal` for the learning platform

### 3. Create Admin User

1. **Sign up** for a new account
2. **Make user admin** in Supabase:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

## 🏗️ Project Structure

```
src/
├── app/(site)/mui-portal/          # Main portal pages
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── dashboard/page.tsx          # User dashboard
│   ├── courses/                     # Course system
│   │   ├── page.tsx               # Courses listing
│   │   └── [id]/page.tsx          # Course detail
│   ├── cohorts/                     # Cohort system
│   │   ├── page.tsx               # Cohorts listing
│   │   └── [id]/page.tsx          # Cohort detail
│   └── admin/                       # Admin section
│       └── page.tsx               # Admin dashboard
├── components/
│   ├── mui-portal-layout.tsx       # Main layout component
│   └── ui.tsx                      # Reusable UI components
├── contexts/
│   └── mui-auth-context.tsx        # Authentication context
├── lib/
│   ├── supabase.ts                  # Supabase client
│   └── mui-portal.ts               # Portal functions & types
└── middleware.ts                   # Auth middleware
```

## 🎯 Key Features Explained

### Authentication System
- **Signup**: Users can create accounts with email/password
- **Login**: Secure authentication with session persistence
- **Profile Management**: Automatic profile creation on signup
- **Role-based Access**: Student and admin roles with different permissions

### Courses System
- **Course Listing**: Browse available courses
- **Course Detail**: View lessons and track progress
- **Progress Tracking**: Mark lessons complete, see overall progress
- **Self-paced Learning**: Learn at your own speed

### Cohort System
- **Secret Key Access**: Secure cohort enrollment
- **Group Learning**: Learn together with peers
- **Progress Tracking**: Cohort-specific progress bars
- **Member Management**: View cohort members and activity

### Admin Capabilities
- **Course Management**: Create and edit courses
- **Cohort Management**: Create cohorts and manage enrollments
- **User Management**: View and manage user profiles
- **Analytics**: Platform usage statistics (basic)

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Auth Middleware**: Route protection for authenticated users
- **Admin Protection**: Admin-only routes and actions
- **Input Validation**: Form validation and sanitization
- **Secure API**: Proper error handling and data validation

## 🎨 UI/UX Design

- **Dark Theme**: Modern, professional dark theme
- **Responsive Design**: Mobile-first approach
- **Clean Components**: Reusable, consistent UI components
- **Smooth Interactions**: Hover effects, transitions, loading states
- **Accessibility**: Semantic HTML, proper ARIA labels

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles with roles
- **courses**: Self-paced course content
- **lessons**: Individual lessons within courses
- **cohorts**: Group learning cohorts
- **enrollments**: User-cohort relationships
- **progress**: Lesson completion tracking

### Features
- **Auto-triggers**: Profile creation on user signup
- **RLS Policies**: Secure data access
- **Progress Functions**: Automatic progress calculation
- **Indexes**: Optimized for performance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure your hosting provider

## 🧪 Testing

### Manual Testing Checklist
- [ ] User signup and login
- [ ] Profile creation and management
- [ ] Course browsing and progress tracking
- [ ] Cohort enrollment with secret keys
- [ ] Admin dashboard functionality
- [ ] Responsive design on mobile
- [ ] Error handling and loading states

### Test Accounts
- **Student**: Regular user access
- **Admin**: Full platform management

## 🔧 Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify logo and tagline in layout
- Customize CSS variables for theme

### Features
- Add new pages in the `mui-portal` directory
- Extend database schema as needed
- Create new UI components in `components/ui.tsx`

## 📝 Development Notes

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Server components where appropriate
- Clean, modular architecture

### Best Practices
- Environment variables for secrets
- Proper error boundaries
- Loading states for better UX
- Semantic HTML structure

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**: Check Supabase credentials
2. **Auth Issues**: Verify RLS policies are correct
3. **Build Errors**: Check TypeScript types
4. **Styling Issues**: Verify Tailwind configuration

### Debug Tips
- Check browser console for errors
- Verify Supabase connection in network tab
- Test database queries in Supabase SQL Editor

## 📄 License

This project is for educational purposes. Feel free to use and modify for your campus initiatives.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Society is shaped by voices; we are the mic** 🎤

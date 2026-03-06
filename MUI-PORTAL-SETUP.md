# MUI Portal - Learning & Cohort Platform Setup Guide

## Overview
MUI Portal is a comprehensive learning and cohort platform built with Next.js, TypeScript, and Supabase. It features self-paced courses, secret-key cohort access, progress tracking, and admin capabilities.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Supabase account (free tier is sufficient)
- Git installed

### 2. Environment Setup

1. **Clone and install dependencies:**
```bash
cd Micdupinitiative
npm install
```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy the Project URL and Anon Key

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

   Update `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Email (for auto-detection)
ADMIN_EMAIL=admin@muiportal.com
```

4. **Set up database:**
   - Open your Supabase project
   - Go to SQL Editor
   - Run the SQL from `supabase-schema.sql`

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── login/           # Authentication pages
│   ├── signup/
│   ├── dashboard/       # User dashboard
│   ├── courses/         # Course system
│   │   └── [id]/       # Individual course pages
│   ├── cohorts/         # Cohort system
│   │   └── [id]/       # Individual cohort pages
│   └── admin/           # Admin panel
│       ├── courses/     # Course management
│       ├── cohorts/     # Cohort management
│       └── users/       # User management
├── components/
│   └── layout/          # Layout components
├── contexts/
│   └── auth-context.tsx # Authentication context
├── lib/
│   └── supabase.ts      # Supabase client
└── middleware.ts        # Route protection
```

## 🔐 Authentication System

### Features
- Email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Role-based access control (student/admin)
- Protected routes with middleware

### Admin Setup
1. Set your admin email in `.env.local`
2. Sign up with that email
3. Manually update the role in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## 📚 Course System

### Features
- Self-paced courses with lessons
- Progress tracking per user
- Lesson completion status
- Course overview with progress bars

### Admin Capabilities
- Create/edit/delete courses
- Add lessons to courses
- View course statistics

## 🎯 Cohort System

### Features
- Secret key-based enrollment
- Member tracking
- Progress tracking per cohort
- Join/leave functionality

### User Flow
1. User receives secret key from admin
2. User enters key on cohorts page
3. System validates and enrolls user
4. User can access cohort content

## 📊 Progress Tracking

### Features
- Individual lesson completion
- Course progress percentages
- Cohort progress tracking
- Overall user progress

### Database Schema
- `progress` table tracks lesson completions
- Calculated percentages in UI
- Real-time progress updates

## 🛡️ Security Features

### Authentication
- Supabase Auth for secure authentication
- JWT token management
- Session persistence

### Authorization
- Role-based access control
- Protected routes middleware
- Row Level Security (RLS) policies

### Data Protection
- User can only access own data
- Admins have elevated privileges
- SQL injection prevention via Supabase

## 🎨 UI/UX Features

### Design System
- Dark theme with amber accents
- Responsive design (mobile-first)
- Smooth transitions and hover effects
- Modern card-based layouts

### Components
- Progress bars with animations
- Hover states on interactive elements
- Loading states and error handling
- Consistent spacing and typography

## 📈 Admin Dashboard

### Features
- User statistics and analytics
- Course and cohort management
- Recent activity monitoring
- Quick access to admin functions

### Management Tools
- Create/edit courses and lessons
- Manage cohorts and enrollments
- View user profiles and roles
- Monitor platform usage

## 🔧 Development

### Key Technologies
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Supabase** - Backend & database
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase URL and keys in `.env.local`
   - Ensure Supabase Auth is enabled in your project

2. **Database errors**
   - Run the schema SQL in Supabase SQL Editor
   - Check RLS policies are properly configured

3. **Admin access denied**
   - Verify admin email matches `.env.local`
   - Manually set role in database if needed

4. **Cohort secret key not working**
   - Check secret key exists in database
   - Ensure user isn't already enrolled

### Debug Mode
Add console logs to identify issues:
```javascript
console.log('Debug info:', data)
```

## 🤝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow existing component patterns
- Use Tailwind for styling
- Maintain consistent naming conventions

### Best Practices
- Test admin functions carefully
- Validate user inputs
- Handle errors gracefully
- Use loading states for async operations

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment variables

## 🔄 Future Enhancements

### Potential Features
- Email notifications
- File uploads for course materials
- Advanced analytics dashboard
- User avatars and profiles
- Discussion forums
- Certificate generation
- API endpoints for mobile app

### Scalability
- Database optimization
- Caching strategies
- CDN for static assets
- Load balancing considerations

---

## 🎉 You're Ready!

Your MUI Portal is now set up and ready to use. Users can:
- Sign up and create profiles
- Enroll in self-paced courses
- Join cohorts with secret keys
- Track their learning progress
- Admins can manage the entire platform

Happy learning! 🚀

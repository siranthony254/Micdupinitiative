#!/bin/bash

# MUI Portal - Production Setup Script
# This script sets up the complete MUI Portal for production

echo "🚀 Setting up MUI Portal for Production..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from template..."
    cp .env.local.example .env.local
    echo "📝 Please edit .env.local with your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "📊 Then run the database schema in Supabase SQL Editor:"
    echo "   1. Open your Supabase project"
    echo "   2. Go to SQL Editor"
    echo "   3. Copy and paste the entire contents of schema.sql"
    echo "   4. Run the script"
    echo ""
    echo "⏸️  Setup paused. Please complete the above steps and run this script again."
    exit 0
fi

# Check environment variables
source .env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables in .env.local"
    echo "   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables check passed"

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Run production server
echo "🌐 Starting production server..."
echo "📍 MUI Portal will be available at: http://localhost:3000/mui-portal"
echo "🔧 Admin access: Use admin@muiportal.com or admin@example.com"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

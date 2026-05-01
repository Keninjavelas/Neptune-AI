#!/bin/bash

# AquaFlow AI - Quick Start Script
# Run this to get the hackathon demo up in minutes!

echo "🌊 AquaFlow AI - Quick Start"
echo "=============================="
echo ""

# Step 1: Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies... (this may take a minute)"
npm run install:all > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Step 3: Start infrastructure
echo "🐳 Starting Docker containers..."
npm run dev:infra > /dev/null 2>&1 &
DOCKER_PID=$!

# Wait for containers to be healthy
echo "⏳ Waiting for containers (30 seconds)..."
sleep 30

# Check if Docker is running
if ! docker ps | grep -q aquaflow_postgres; then
    echo "❌ Failed to start Docker containers"
    exit 1
fi

echo "✅ Containers running"
echo ""

# Step 4: Show next steps
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1️⃣  Open Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "2️⃣  Open Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "3️⃣  Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "🎬 Demo Flow:"
echo "   - Show dashboard (normal operation)"
echo "   - Simulate leak (block pump inlet)"
echo "   - Watch alert + valve auto-close"
echo "   - Recover (unblock inlet)"
echo ""
echo "📖 Full guide: See README.md"
echo ""

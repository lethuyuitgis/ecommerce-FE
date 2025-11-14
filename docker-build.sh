#!/bin/bash

# Docker Build Script for E-commerce Application

set -e

echo "🚀 Building E-commerce Application with Docker..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_warning "Docker is not running. Please start Docker first."
    exit 1
fi

# Parse arguments
MODE=${1:-production}
BUILD_ONLY=${2:-false}

print_info "Mode: $MODE"

# Build backend
print_info "Building backend..."
cd e-commerce-backend
docker build -t ecommerce-backend:latest .
cd ..
print_success "Backend built successfully"

# Build frontend
print_info "Building frontend..."
docker build -t ecommerce-frontend:latest .
print_success "Frontend built successfully"

if [ "$BUILD_ONLY" = "true" ]; then
    print_success "Build completed. Images ready to use."
    exit 0
fi

# Start services
if [ "$MODE" = "dev" ]; then
    print_info "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started"
    print_info "Backend: http://localhost:8080"
    print_info "MinIO: http://localhost:9000 (Console: http://localhost:9090)"
else
    print_info "Starting production environment..."
    docker-compose up -d --build
    print_success "Production environment started"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend: http://localhost:8080"
    print_info "MinIO: http://localhost:9000 (Console: http://localhost:9090)"
fi

print_info "To view logs: docker-compose logs -f"
print_info "To stop: docker-compose down"


#!/bin/bash

# Install MySQL on macOS using Homebrew

echo "🗄️ MySQL Installation Script for macOS"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_error "Homebrew is not installed"
    print_info "Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if command -v brew &> /dev/null; then
        print_status "Homebrew installed successfully"
    else
        print_error "Failed to install Homebrew"
        exit 1
    fi
else
    print_status "Homebrew is already installed"
fi

# Update Homebrew
print_info "Updating Homebrew..."
brew update

# Check if MySQL is already installed
if brew list mysql &> /dev/null; then
    print_warning "MySQL is already installed"
    mysql --version
else
    print_info "Installing MySQL..."
    brew install mysql
    
    if [ $? -eq 0 ]; then
        print_status "MySQL installed successfully"
    else
        print_error "Failed to install MySQL"
        exit 1
    fi
fi

# Start MySQL service
print_info "Starting MySQL service..."
brew services start mysql

sleep 3

# Check if MySQL is running
if pgrep -x "mysqld" > /dev/null; then
    print_status "MySQL service is running"
else
    print_warning "MySQL service might not be running properly"
fi

# Secure installation
print_info "MySQL has been installed!"
echo ""
print_warning "IMPORTANT: You should run MySQL secure installation:"
echo "mysql_secure_installation"
echo ""
print_info "This will help you:"
echo "• Set a password for the root account"
echo "• Remove anonymous user accounts"
echo "• Disable root logins from outside localhost"
echo "• Remove test databases"
echo ""

# Show connection info
print_info "Connection Information:"
echo "Host: localhost"
echo "Port: 3306"
echo "User: root"
echo "Password: (set during secure installation)"
echo ""

print_info "To connect to MySQL:"
echo "mysql -u root -p"
echo ""

print_info "To create your portfolio database:"
echo "mysql -u root -p -e \"CREATE DATABASE portfolio_db;\""
echo ""

print_status "MySQL installation completed!"
print_info "Don't forget to update your .env.local file with the correct credentials"

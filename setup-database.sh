#!/bin/bash

# Portfolio Database Setup Script for MySQL

echo "🚀 Portfolio Database Setup for MySQL"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if MySQL is installed
echo ""
print_info "Checking MySQL installation..."

if command -v mysql &> /dev/null; then
    print_status "MySQL is installed"
    mysql --version
else
    print_error "MySQL is not installed"
    echo ""
    print_info "Please install MySQL first:"
    echo "  • macOS: brew install mysql"
    echo "  • Ubuntu: sudo apt-get install mysql-server"
    echo "  • Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if MySQL service is running
echo ""
print_info "Checking MySQL service..."

if pgrep -x "mysqld" > /dev/null; then
    print_status "MySQL service is running"
else
    print_warning "MySQL service is not running"
    print_info "Starting MySQL service..."
    
    # Try to start MySQL (different commands for different systems)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mysql || sudo /usr/local/mysql/support-files/mysql.server start
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo systemctl start mysql || sudo service mysql start
    fi
    
    sleep 3
    
    if pgrep -x "mysqld" > /dev/null; then
        print_status "MySQL service started successfully"
    else
        print_error "Failed to start MySQL service"
        exit 1
    fi
fi

# Get database configuration
echo ""
print_info "Database Configuration"
echo "======================"

# Read from .env.local if it exists
if [ -f ".env.local" ]; then
    source .env.local 2>/dev/null || true
fi

# Set default values
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_NAME=${DB_NAME:-portfolio_db}

echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "User: $DB_USER"
echo "Database: $DB_NAME"

# Prompt for MySQL root password
echo ""
print_info "Please enter your MySQL root password:"
read -s MYSQL_ROOT_PASSWORD

# Test MySQL connection
echo ""
print_info "Testing MySQL connection..."

mysql -h "$DB_HOST" -P "$DB_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &>/dev/null

if [ $? -eq 0 ]; then
    print_status "MySQL connection successful"
else
    print_error "MySQL connection failed"
    print_info "Please check your MySQL root password and try again"
    exit 1
fi

# Create database
echo ""
print_info "Creating database '$DB_NAME'..."

mysql -h "$DB_HOST" -P "$DB_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" -e "
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
" 2>/dev/null

if [ $? -eq 0 ]; then
    print_status "Database '$DB_NAME' created successfully"
else
    print_error "Failed to create database '$DB_NAME'"
    exit 1
fi

# Create database user (optional)
if [ "$DB_USER" != "root" ]; then
    echo ""
    print_info "Creating database user '$DB_USER'..."
    
    mysql -h "$DB_HOST" -P "$DB_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" -e "
    CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
    GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
    FLUSH PRIVILEGES;
    " 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_status "Database user '$DB_USER' created successfully"
    else
        print_warning "Failed to create database user (this is optional)"
    fi
fi

# Test the application database connection
echo ""
print_info "Testing application database connection..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing Node.js dependencies..."
    npm install
fi

# Test the connection using our database module
node -e "
const { testConnection, initializeDatabase } = require('./src/lib/database.ts');
(async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('✅ Application database connection successful');
      const initialized = await initializeDatabase();
      if (initialized) {
        console.log('✅ Database tables created successfully');
      } else {
        console.log('❌ Failed to create database tables');
        process.exit(1);
      }
    } else {
      console.log('❌ Application database connection failed');
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }
})();
" || {
    print_error "Application database connection test failed"
    print_info "Please check your .env.local configuration"
    exit 1
}

# Success message
echo ""
print_status "Database setup completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Make sure your .env.local file has the correct database credentials"
echo "2. Run 'npm run dev' to start your application"
echo "3. Test the contact form to ensure database integration works"
echo ""
print_info "Database connection details:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""
print_info "You can connect to your database using:"
echo "mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p $DB_NAME"

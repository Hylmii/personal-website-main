# Portfolio Contact API Documentation

## Overview
API untuk mengelola pesan contact form dari portfolio website dengan integrasi MySQL database.

## Database Schema

### Table: `contacts`
```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Send Email & Save Contact
**POST** `/api/send-email`

Mengirim email dan menyimpan pesan ke database.

**Request Body:**
```json
{
  "from_name": "John Doe",
  "from_email": "john@example.com",
  "company": "Example Corp",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in your services..."
}
```

**Response:**
```json
{
  "message": "Email sent successfully and saved to database",
  "messageId": "email-message-id",
  "databaseId": 123
}
```

### 2. Get All Contacts
**GET** `/api/contacts`

Mengambil semua contacts dengan pagination dan filter.

**Query Parameters:**
- `page` (number): Halaman (default: 1)
- `limit` (number): Jumlah per halaman (default: 10)
- `status` (string): Filter by status (new|read|replied|archived)

**Example:**
```
GET /api/contacts?page=1&limit=10&status=new
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Example Corp",
      "subject": "Project Inquiry",
      "message": "Hello, I'm interested...",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "status": "new",
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "total": 47,
    "limit": 10
  }
}
```

### 3. Get Contact by ID
**GET** `/api/contacts/[id]`

Mengambil contact specific berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "subject": "Project Inquiry",
    "message": "Hello, I'm interested...",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "status": "new",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Contact Status
**PATCH** `/api/contacts/[id]`

Update status contact (new, read, replied, archived).

**Request Body:**
```json
{
  "status": "read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact status updated successfully"
}
```

### 5. Delete Contact
**DELETE** `/api/contacts/[id]`

Hapus contact dari database.

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### 6. Get Contact Statistics
**GET** `/api/contacts/stats`

Mengambil statistik contacts untuk dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 47,
    "byStatus": [
      { "status": "new", "count": 15 },
      { "status": "read", "count": 20 },
      { "status": "replied", "count": 10 },
      { "status": "archived", "count": 2 }
    ],
    "byDate": [
      { "date": "2025-01-15", "count": 5 },
      { "date": "2025-01-14", "count": 3 }
    ],
    "recent": [
      {
        "id": 47,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "subject": "Collaboration",
        "status": "new",
        "created_at": "2025-01-15T15:30:00.000Z"
      }
    ],
    "topCompanies": [
      { "company": "Tech Corp", "count": 5 },
      { "company": "Design Studio", "count": 3 }
    ]
  }
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request (missing/invalid data) |
| 404  | Contact not found |
| 500  | Internal Server Error |

## Error Response Format

```json
{
  "error": "Error message description"
}
```

## Environment Variables

Required in `.env.local`:

```bash
# Database Configuration - MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

## Setup Instructions

1. **Install MySQL Server**
   ```bash
   # macOS
   brew install mysql
   
   # Ubuntu
   sudo apt-get install mysql-server
   ```

2. **Install Dependencies**
   ```bash
   npm install mysql2
   ```

3. **Configure Environment**
   - Update `.env.local` with your MySQL credentials
   - Make sure MySQL server is running

4. **Setup Database**
   ```bash
   ./setup-database.sh
   ```

5. **Test Connection**
   ```bash
   npm run dev
   ```

## Security Features

- **SQL Injection Protection**: Menggunakan prepared statements
- **Input Validation**: Validasi semua input data
- **IP Logging**: Merecord IP address dan User Agent
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Proper error handling dan logging

## Usage Examples

### Frontend JavaScript Example

```javascript
// Send contact form
const sendContact = async (formData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Message sent:', result.databaseId);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Get contacts (admin)
const getContacts = async (page = 1, status = '') => {
  try {
    const url = new URL('/api/contacts', window.location.origin);
    url.searchParams.set('page', page);
    if (status) url.searchParams.set('status', status);
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
};
```

### cURL Examples

```bash
# Send contact message
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "from_name": "John Doe",
    "from_email": "john@example.com", 
    "company": "Example Corp",
    "subject": "Project Inquiry",
    "message": "Hello, I am interested in your services."
  }'

# Get all contacts
curl http://localhost:3000/api/contacts?page=1&limit=10

# Update contact status
curl -X PATCH http://localhost:3000/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "read"}'

# Get statistics
curl http://localhost:3000/api/contacts/stats
```

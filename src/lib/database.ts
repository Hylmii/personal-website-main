import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database and create tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create contacts table if it doesn't exist
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createContactsTable);
    console.log('✅ Contacts table created/verified successfully');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Contact interface
export interface Contact {
  id?: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  created_at?: Date;
  updated_at?: Date;
}

// Insert new contact message
export async function insertContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  try {
    const connection = await pool.getConnection();
    
    const insertQuery = `
      INSERT INTO contacts (name, email, company, subject, message, ip_address, user_agent, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.execute(insertQuery, [
      contact.name,
      contact.email,
      contact.company || null,
      contact.subject,
      contact.message,
      contact.ip_address || null,
      contact.user_agent || null,
      contact.status || 'new'
    ]);
    
    connection.release();
    
    const insertResult = result as mysql.ResultSetHeader;
    console.log('✅ Contact saved to database with ID:', insertResult.insertId);
    
    return insertResult.insertId;
  } catch (error) {
    console.error('❌ Failed to insert contact:', error);
    throw error;
  }
}

// Get all contacts with pagination
export async function getContacts(
  page: number = 1, 
  limit: number = 10, 
  status?: string
): Promise<{ 
  contacts: Contact[]; 
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
}> {
  try {
    const connection = await pool.getConnection();
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let queryParams: any[] = [];
    
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      whereClause = 'WHERE status = ?';
      queryParams.push(status);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const total = (countResult as any)[0].total;
    
        // Get contacts with pagination - use query instead of execute for MySQL 9.4 compatibility
    let selectQuery = `
      SELECT * FROM contacts 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${parseInt(limit.toString())} OFFSET ${parseInt(offset.toString())}
    `;
    
    // For status filtering, we still need to use execute with parameters
    if (status) {
      selectQuery = `
        SELECT * FROM contacts 
        WHERE status = ?
        ORDER BY created_at DESC 
        LIMIT ${parseInt(limit.toString())} OFFSET ${parseInt(offset.toString())}
      `;
      const [contacts] = await connection.execute(selectQuery, [status]);
      connection.release();
      return {
        contacts: contacts as Contact[],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } else {
      const [contacts] = await connection.query(selectQuery);
      connection.release();
      return {
        contacts: contacts as Contact[],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    }
  } catch (error) {
    console.error('❌ Failed to get contacts:', error);
    throw error;
  }
}

// Update contact status
export async function updateContactStatus(id: number, status: 'new' | 'read' | 'replied' | 'archived'): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    
    const updateQuery = 'UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await connection.execute(updateQuery, [status, id]);
    
    connection.release();
    
    const updateResult = result as mysql.ResultSetHeader;
    return updateResult.affectedRows > 0;
  } catch (error) {
    console.error('❌ Failed to update contact status:', error);
    throw error;
  }
}

// Get contact by ID
export async function getContactById(id: number): Promise<Contact | null> {
  try {
    const connection = await pool.getConnection();
    
    const selectQuery = 'SELECT * FROM contacts WHERE id = ?';
    const [result] = await connection.execute(selectQuery, [id]);
    
    connection.release();
    
    const contacts = result as Contact[];
    return contacts.length > 0 ? contacts[0] : null;
  } catch (error) {
    console.error('❌ Failed to get contact by ID:', error);
    throw error;
  }
}

// Delete contact
export async function deleteContact(id: number): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    
    const deleteQuery = 'DELETE FROM contacts WHERE id = ?';
    const [result] = await connection.execute(deleteQuery, [id]);
    
    connection.release();
    
    const deleteResult = result as mysql.ResultSetHeader;
    return deleteResult.affectedRows > 0;
  } catch (error) {
    console.error('❌ Failed to delete contact:', error);
    throw error;
  }
}

export default pool;

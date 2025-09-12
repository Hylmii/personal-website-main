import Database from 'better-sqlite3';
import path from 'path';

// SQLite database configuration
const dbPath = path.join(process.cwd(), 'portfolio.db');

let db: Database.Database | null = null;

// Initialize SQLite database
export function initSQLiteDatabase() {
  try {
    if (!db) {
      db = new Database(dbPath);
      console.log('✅ SQLite database connected successfully');
    }

    // Create contacts table if it doesn't exist
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'archived')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.exec(createContactsTable);
    console.log('✅ SQLite contacts table created/verified successfully');

    return true;
  } catch (error) {
    console.error('❌ SQLite database initialization failed:', error);
    return false;
  }
}

// SQLite Contact interface
export interface SQLiteContact {
  id?: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  created_at?: string;
  updated_at?: string;
}

// Insert new contact message
export function insertSQLiteContact(contact: Omit<SQLiteContact, 'id' | 'created_at' | 'updated_at'>): number {
  try {
    if (!db) initSQLiteDatabase();

    const insertQuery = `
      INSERT INTO contacts (name, email, company, subject, message, ip_address, user_agent, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stmt = db!.prepare(insertQuery);
    const result = stmt.run(
      contact.name,
      contact.email,
      contact.company || null,
      contact.subject,
      contact.message,
      contact.ip_address || null,
      contact.user_agent || null,
      contact.status || 'new'
    );

    console.log('✅ Contact saved to SQLite with ID:', result.lastInsertRowid);
    return result.lastInsertRowid as number;
  } catch (error) {
    console.error('❌ Failed to insert contact to SQLite:', error);
    throw error;
  }
}

// Get all contacts with pagination
export function getSQLiteContacts(
  page: number = 1,
  limit: number = 10,
  status?: string
): { contacts: SQLiteContact[]; total: number; totalPages: number } {
  try {
    if (!db) initSQLiteDatabase();

    const offset = (page - 1) * limit;
    let whereClause = '';
    let params: any[] = [];

    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
    const countStmt = db!.prepare(countQuery);
    const countResult = countStmt.get(...params) as { total: number };
    const total = countResult.total;

    // Get contacts with pagination
    const selectQuery = `
      SELECT * FROM contacts 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const selectStmt = db!.prepare(selectQuery);
    const contacts = selectStmt.all(...params, limit, offset) as SQLiteContact[];

    return {
      contacts,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('❌ Failed to get SQLite contacts:', error);
    throw error;
  }
}

// Get contact statistics
export function getSQLiteContactStats(): any {
  try {
    if (!db) initSQLiteDatabase();

    // Get total contacts
    const totalStmt = db!.prepare('SELECT COUNT(*) as total FROM contacts');
    const total = (totalStmt.get() as { total: number }).total;

    // Get contacts by status
    const statusStmt = db!.prepare(`
      SELECT status, COUNT(*) as count
      FROM contacts 
      GROUP BY status
    `);
    const byStatus = statusStmt.all();

    // Get contacts by date (last 30 days)
    const dateStmt = db!.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM contacts 
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    const byDate = dateStmt.all();

    // Get recent contacts
    const recentStmt = db!.prepare(`
      SELECT id, name, email, subject, status, created_at
      FROM contacts 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const recent = recentStmt.all();

    // Get top companies
    const companiesStmt = db!.prepare(`
      SELECT 
        COALESCE(company, 'No Company') as company,
        COUNT(*) as count
      FROM contacts 
      WHERE company IS NOT NULL AND company != ''
      GROUP BY company
      ORDER BY count DESC
      LIMIT 10
    `);
    const topCompanies = companiesStmt.all();

    return {
      total,
      byStatus,
      byDate,
      recent,
      topCompanies
    };
  } catch (error) {
    console.error('❌ Failed to get SQLite contact stats:', error);
    throw error;
  }
}

// Update contact status
export function updateSQLiteContactStatus(id: number, status: 'new' | 'read' | 'replied' | 'archived'): boolean {
  try {
    if (!db) initSQLiteDatabase();

    const updateStmt = db!.prepare(`
      UPDATE contacts 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = updateStmt.run(status, id);

    return result.changes > 0;
  } catch (error) {
    console.error('❌ Failed to update SQLite contact status:', error);
    throw error;
  }
}

// Get contact by ID
export function getSQLiteContactById(id: number): SQLiteContact | null {
  try {
    if (!db) initSQLiteDatabase();

    const selectStmt = db!.prepare('SELECT * FROM contacts WHERE id = ?');
    const contact = selectStmt.get(id) as SQLiteContact | undefined;

    return contact || null;
  } catch (error) {
    console.error('❌ Failed to get SQLite contact by ID:', error);
    throw error;
  }
}

// Delete contact
export function deleteSQLiteContact(id: number): boolean {
  try {
    if (!db) initSQLiteDatabase();

    const deleteStmt = db!.prepare('DELETE FROM contacts WHERE id = ?');
    const result = deleteStmt.run(id);

    return result.changes > 0;
  } catch (error) {
    console.error('❌ Failed to delete SQLite contact:', error);
    throw error;
  }
}

// Test SQLite connection
export function testSQLiteConnection(): boolean {
  try {
    if (!db) initSQLiteDatabase();
    
    // Test query
    const testStmt = db!.prepare('SELECT 1 as test');
    const result = testStmt.get();
    
    return result !== undefined;
  } catch (error) {
    console.error('❌ SQLite connection test failed:', error);
    return false;
  }
}

export default db;

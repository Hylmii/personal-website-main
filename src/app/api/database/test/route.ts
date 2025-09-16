import { NextRequest, NextResponse } from 'next/server';
import { testConnection, initializeDatabase } from '@/lib/database';
import { initSQLiteDatabase, getSQLiteContacts, insertSQLiteContact, testSQLiteConnection } from '@/lib/sqlite';
import pool from '@/lib/database';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/database/test - Test database connection and show basic info
export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('MySQL failed, falling back to SQLite for database test...');
      
      try {
        // Test SQLite fallback
        initSQLiteDatabase();
        const sqliteWorking = testSQLiteConnection();
        
        if (!sqliteWorking) {
          return NextResponse.json({
            success: false,
            error: 'Both MySQL and SQLite connection failed',
            details: 'Unable to connect to any database.'
          }, { status: 500 });
        }

        // Get SQLite info
        const contacts = getSQLiteContacts(1, 5);
        
        // Create SQLite structure information
        const sqliteStructure = [
          { Field: 'id', Type: 'INTEGER PRIMARY KEY AUTOINCREMENT', Null: 'NO', Key: 'PRI' },
          { Field: 'name', Type: 'TEXT NOT NULL', Null: 'NO', Key: '' },
          { Field: 'email', Type: 'TEXT NOT NULL', Null: 'NO', Key: '' },
          { Field: 'company', Type: 'TEXT', Null: 'YES', Key: '' },
          { Field: 'subject', Type: 'TEXT NOT NULL', Null: 'NO', Key: '' },
          { Field: 'message', Type: 'TEXT NOT NULL', Null: 'NO', Key: '' },
          { Field: 'ip_address', Type: 'TEXT', Null: 'YES', Key: '' },
          { Field: 'user_agent', Type: 'TEXT', Null: 'YES', Key: '' },
          { Field: 'status', Type: 'TEXT DEFAULT \'new\'', Null: 'NO', Key: '' },
          { Field: 'created_at', Type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', Null: 'NO', Key: '' },
          { Field: 'updated_at', Type: 'DATETIME DEFAULT CURRENT_TIMESTAMP', Null: 'NO', Key: '' }
        ];
        
        return NextResponse.json({
          success: true,
          message: 'Using SQLite database (MySQL unavailable)',
          databaseInfo: {
            version: 'SQLite 3.x',
            currentDatabase: 'portfolio.db (SQLite)',
            tables: ['contacts'],
            contactsTable: {
              totalRecords: contacts.total,
              structure: sqliteStructure
            },
            recentContacts: contacts.contacts
          },
          connectionConfig: {
            type: 'SQLite',
            file: 'portfolio.db',
            fallbackReason: 'MySQL connection refused'
          },
          source: 'SQLite'
        });
        
      } catch (sqliteError) {
        return NextResponse.json({
          success: false,
          error: 'Database connection failed',
          details: 'Both MySQL and SQLite failed',
          possibleSolutions: [
            'For MySQL: Check if MySQL server is running',
            'For MySQL: Verify database credentials in .env.local',
            'For SQLite: Check file permissions',
            'Try restarting the development server'
          ]
        }, { status: 500 });
      }
    }

    // Initialize database if needed
    const initialized = await initializeDatabase();
    
    if (!initialized) {
      return NextResponse.json({
        success: false,
        error: 'Database initialization failed',
        details: 'Connected but failed to create/verify tables.'
      }, { status: 500 });
    }

    // Get database info
    const connection = await pool.getConnection();
    
    // Get database version
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    const version = (versionResult as any)[0].version;
    
    // Get current database name
    const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
    const currentDb = (dbResult as any)[0].current_db;
    
    // Get table info
    const [tablesResult] = await connection.execute('SHOW TABLES');
    const tables = (tablesResult as any[]).map(row => Object.values(row)[0]);
    
    // Get contacts table info if exists
    let contactsInfo = null;
    if (tables.includes('contacts')) {
      const [contactsCount] = await connection.execute('SELECT COUNT(*) as count FROM contacts');
      const [contactsStructure] = await connection.execute('DESCRIBE contacts');
      
      contactsInfo = {
        totalRecords: (contactsCount as any)[0].count,
        structure: contactsStructure
      };
    }
    
    // Get recent contacts
    let recentContacts = [];
    if (tables.includes('contacts')) {
      const [recentResult] = await connection.execute(`
        SELECT id, name, email, subject, status, created_at 
        FROM contacts 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      recentContacts = recentResult as any[];
    }
    
    connection.release();

    return NextResponse.json({
      success: true,
      message: 'MySQL database connection successful',
      databaseInfo: {
        version,
        currentDatabase: currentDb,
        tables,
        contactsTable: contactsInfo,
        recentContacts
      },
      connectionConfig: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'portfolio_db'
      },
      source: 'MySQL'
    });

  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      possibleSolutions: [
        'Check if MySQL server is running',
        'Verify database credentials in .env.local',
        'Ensure database exists',
        'Check network connectivity',
        'Verify MySQL port is accessible'
      ]
    }, { status: 500 });
  }
}

// POST /api/database/test - Run specific database operations
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('MySQL failed, falling back to SQLite for database operations...');
      
      try {
        initSQLiteDatabase();
        
        switch (action) {
          case 'create-sample-data':
            const insertId = insertSQLiteContact({
              name: 'Test User',
              email: 'test@example.com',
              company: 'Test Company',
              subject: 'Test Subject',
              message: 'This is a test message created by the database test endpoint.',
              status: 'new'
            });
            
            return NextResponse.json({
              success: true,
              message: 'Sample data created successfully in SQLite',
              insertId,
              source: 'SQLite'
            });
            
          case 'clear-test-data':
            // Note: SQLite delete would need a custom function
            return NextResponse.json({
              success: true,
              message: 'Clear operation noted for SQLite (not implemented)',
              source: 'SQLite'
            });
            
          default:
            return NextResponse.json({
              success: false,
              error: 'Invalid action',
              availableActions: ['create-sample-data', 'clear-test-data']
            }, { status: 400 });
        }
        
      } catch (sqliteError) {
        return NextResponse.json({
          success: false,
          error: 'SQLite operation failed',
          details: sqliteError instanceof Error ? sqliteError.message : 'Unknown error'
        }, { status: 500 });
      }
    }
    
    // MySQL operations
    switch (action) {
      case 'create-sample-data':
        // Create sample contact for testing
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`
          INSERT INTO contacts (name, email, company, subject, message, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          'Test User',
          'test@example.com',
          'Test Company',
          'Test Subject',
          'This is a test message created by the database test endpoint.',
          'new'
        ]);
        connection.release();
        
        const insertResult = result as any;
        return NextResponse.json({
          success: true,
          message: 'Sample data created successfully in MySQL',
          insertId: insertResult.insertId,
          source: 'MySQL'
        });
        
      case 'clear-test-data':
        // Clear test data
        const clearConnection = await pool.getConnection();
        await clearConnection.execute(`
          DELETE FROM contacts WHERE email = 'test@example.com'
        `);
        clearConnection.release();
        
        return NextResponse.json({
          success: true,
          message: 'Test data cleared successfully from MySQL',
          source: 'MySQL'
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['create-sample-data', 'clear-test-data']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Database operation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

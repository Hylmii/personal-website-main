import { NextRequest, NextResponse } from 'next/server';
import { 
  getContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact,
  testConnection,
  initializeDatabase
} from '@/lib/database';
import { 
  getSQLiteContacts, 
  getSQLiteContactById, 
  updateSQLiteContactStatus, 
  deleteSQLiteContact,
  initSQLiteDatabase 
} from '@/lib/sqlite';

// GET /api/contacts - Get all contacts with pagination
export async function GET(request: NextRequest) {
  try {
    // Test MySQL connection first
    const isConnected = await testConnection();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;

    if (!isConnected) {
      console.log('⚠️ MySQL failed, falling back to SQLite for contacts...');
      try {
        // Fallback to SQLite
        initSQLiteDatabase();
        const result = getSQLiteContacts(page, limit, status);

        return NextResponse.json({
          success: true,
          data: result.contacts,
          pagination: {
            currentPage: page,
            totalPages: result.totalPages,
            total: result.total,
            limit
          },
          source: 'SQLite'
        });
      } catch (sqliteError) {
        console.error('❌ SQLite contacts failed:', sqliteError);
        return NextResponse.json({ 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to both MySQL and SQLite databases'
        }, { status: 500 });
      }
    }

    // Initialize MySQL database if connected
    await initializeDatabase();

    const result = await getContacts(page, limit, status);

    return NextResponse.json({
      success: true,
      data: result.contacts,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        total: result.total,
        limit
      },
      source: 'MySQL'
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contacts' 
    }, { status: 500 });
  }
}

// POST /api/contacts - Create new contact (alternative to send-email)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // This would be handled by the send-email endpoint usually
    return NextResponse.json({ 
      message: 'Use /api/send-email endpoint for creating contacts' 
    }, { status: 400 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ 
      error: 'Failed to create contact' 
    }, { status: 500 });
  }
}

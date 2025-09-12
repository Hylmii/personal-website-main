import { NextRequest, NextResponse } from 'next/server';
import { getContactById, updateContactStatus, deleteContact, testConnection } from '@/lib/database';
import { getSQLiteContactById, updateSQLiteContactStatus, deleteSQLiteContact, initSQLiteDatabase } from '@/lib/sqlite';

// GET /api/contacts/[id] - Get specific contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ 
        error: 'Invalid contact ID' 
      }, { status: 400 });
    }

    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('⚠️ MySQL failed, falling back to SQLite for contact...');
      try {
        // Fallback to SQLite
        initSQLiteDatabase();
        const contact = getSQLiteContactById(id);
        
        if (!contact) {
          return NextResponse.json({ 
            error: 'Contact not found' 
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: contact,
          source: 'SQLite'
        });
      } catch (sqliteError) {
        console.error('❌ SQLite contact fetch failed:', sqliteError);
        return NextResponse.json({ 
          error: 'Database connection failed' 
        }, { status: 500 });
      }
    }

    const contact = await getContactById(id);
    
    if (!contact) {
      return NextResponse.json({ 
        error: 'Contact not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact,
      source: 'MySQL'
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact' 
    }, { status: 500 });
  }
}

// PATCH /api/contacts/[id] - Update contact status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ 
        error: 'Invalid contact ID' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'read', 'replied', 'archived'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be: new, read, replied, or archived' 
      }, { status: 400 });
    }

    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('⚠️ MySQL failed, falling back to SQLite for update...');
      try {
        // Fallback to SQLite
        initSQLiteDatabase();
        const updated = updateSQLiteContactStatus(id, status);
        
        if (!updated) {
          return NextResponse.json({ 
            error: 'Contact not found or update failed' 
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'Contact status updated successfully',
          source: 'SQLite'
        });
      } catch (sqliteError) {
        console.error('❌ SQLite contact update failed:', sqliteError);
        return NextResponse.json({ 
          error: 'Database connection failed' 
        }, { status: 500 });
      }
    }

    const updated = await updateContactStatus(id, status);
    
    if (!updated) {
      return NextResponse.json({ 
        error: 'Contact not found or update failed' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact status updated successfully',
      source: 'MySQL'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ 
      error: 'Failed to update contact' 
    }, { status: 500 });
  }
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ 
        error: 'Invalid contact ID' 
      }, { status: 400 });
    }

    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('⚠️ MySQL failed, falling back to SQLite for delete...');
      try {
        // Fallback to SQLite
        initSQLiteDatabase();
        const deleted = deleteSQLiteContact(id);
        
        if (!deleted) {
          return NextResponse.json({ 
            error: 'Contact not found or deletion failed' 
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'Contact deleted successfully',
          source: 'SQLite'
        });
      } catch (sqliteError) {
        console.error('❌ SQLite contact delete failed:', sqliteError);
        return NextResponse.json({ 
          error: 'Database connection failed' 
        }, { status: 500 });
      }
    }

    const deleted = await deleteContact(id);
    
    if (!deleted) {
      return NextResponse.json({ 
        error: 'Contact not found or deletion failed' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
      source: 'MySQL'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ 
      error: 'Failed to delete contact' 
    }, { status: 500 });
  }
}

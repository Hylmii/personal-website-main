import { NextRequest, NextResponse } from 'next/server';
import pool, { testConnection, initializeDatabase } from '@/lib/database';
import { getSQLiteContactStats, initSQLiteDatabase } from '@/lib/sqlite';

// GET /api/contacts/stats - Get contact statistics
export async function GET(request: NextRequest) {
  try {
    // Test MySQL connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('⚠️ MySQL failed, falling back to SQLite for stats...');
      try {
        // Fallback to SQLite
        initSQLiteDatabase();
        const sqliteStats = getSQLiteContactStats();
        
        return NextResponse.json({
          success: true,
          data: sqliteStats,
          source: 'SQLite'
        });
      } catch (sqliteError) {
        console.error('❌ SQLite stats failed:', sqliteError);
        return NextResponse.json({
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to both MySQL and SQLite databases'
        }, { status: 500 });
      }
    }

    // Initialize database if needed
    await initializeDatabase();

    const connection = await pool.getConnection();
    
    try {
      // Check if contacts table exists
      const [tableCheck] = await connection.execute(`
        SELECT COUNT(*) as table_exists 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'contacts'
      `);
      
      const tableExists = (tableCheck as any)[0].table_exists > 0;
      
      if (!tableExists) {
        return NextResponse.json({
          success: false,
          error: 'Contacts table does not exist',
          details: 'The contacts table has not been created yet. Try sending a contact form first.'
        }, { status: 404 });
      }
      
      // Get total contacts
      const [totalResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM contacts'
      );
      const total = (totalResult as any)[0].total;

      // Get contacts by status
      const [statusResult] = await connection.execute(`
        SELECT 
          status,
          COUNT(*) as count
        FROM contacts 
        GROUP BY status
      `);

      // Get contacts by date (last 30 days)
      const [dateResult] = await connection.execute(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM contacts 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);

      // Get recent contacts
      const [recentResult] = await connection.execute(`
        SELECT 
          id, name, email, subject, status, created_at
        FROM contacts 
        ORDER BY created_at DESC 
        LIMIT 5
      `);

      // Get top companies
      const [companiesResult] = await connection.execute(`
        SELECT 
          COALESCE(company, 'No Company') as company,
          COUNT(*) as count
        FROM contacts 
        WHERE company IS NOT NULL AND company != ''
        GROUP BY company
        ORDER BY count DESC
        LIMIT 10
      `);

      const stats = {
        total,
        byStatus: statusResult,
        byDate: dateResult,
        recent: recentResult,
        topCompanies: companiesResult
      };

      return NextResponse.json({
        success: true,
        data: stats,
        source: 'MySQL'
      });
      
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch contact statistics',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

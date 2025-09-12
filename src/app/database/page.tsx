'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DatabaseViewer() {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/database/test');
      const result = await response.json();
      
      if (response.ok) {
        setDbInfo(result);
      } else {
        setError(result.error || 'Failed to test database');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    try {
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-sample-data' })
      });
      
      if (response.ok) {
        testDatabase(); // Refresh data
      } else {
        const result = await response.json();
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create sample data');
    }
  };

  const clearTestData = async () => {
    try {
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-test-data' })
      });
      
      if (response.ok) {
        testDatabase(); // Refresh data
        if (showAllContacts) {
          fetchAllContacts(); // Refresh contacts list if shown
        }
      } else {
        const result = await response.json();
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to clear test data');
    }
  };

  const fetchAllContacts = async () => {
    setContactsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/contacts?limit=100'); // Get more contacts
      const result = await response.json();
      
      if (response.ok && result.success) {
        setAllContacts(result.data);
        setShowAllContacts(true);
      } else {
        setError(result.error || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error occurred while fetching contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Viewer</h1>
          <p className="text-gray-600">Test and view your MySQL database connection</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError('')}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 space-x-4">
          <button
            onClick={testDatabase}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </button>
          
          {dbInfo?.success && (
            <>
              <button
                onClick={createSampleData}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Sample Data
              </button>
              
              <button
                onClick={clearTestData}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear Test Data
              </button>

              <button
                onClick={fetchAllContacts}
                disabled={contactsLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {contactsLoading ? 'Loading...' : showAllContacts ? 'Refresh All Contacts' : 'View All Contacts'}
              </button>
            </>
          )}
        </div>

        {/* Database Info */}
        {dbInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Connection Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Connection Status</h2>
              <div className={`p-4 rounded ${dbInfo.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {dbInfo.success ? '✅ Connected Successfully' : '❌ Connection Failed'}
              </div>
            </div>

            {/* Database Information */}
            {dbInfo.success && dbInfo.databaseInfo && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  Database Information
                  {dbInfo.source && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      dbInfo.source === 'MySQL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {dbInfo.source}
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Database Version:</strong> {dbInfo.databaseInfo.version}
                  </div>
                  <div>
                    <strong>Current Database:</strong> {dbInfo.databaseInfo.currentDatabase}
                  </div>
                  {dbInfo.source === 'MySQL' ? (
                    <>
                      <div>
                        <strong>Host:</strong> {dbInfo.connectionConfig.host}
                      </div>
                      <div>
                        <strong>Port:</strong> {dbInfo.connectionConfig.port}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <strong>File:</strong> {dbInfo.connectionConfig.file}
                      </div>
                      <div>
                        <strong>Type:</strong> {dbInfo.connectionConfig.type}
                      </div>
                    </>
                  )}
                </div>
                {dbInfo.source === 'SQLite' && dbInfo.connectionConfig.fallbackReason && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-sm">
                      <strong>Fallback Mode:</strong> {dbInfo.connectionConfig.fallbackReason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tables */}
            {dbInfo.success && dbInfo.databaseInfo?.tables && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Database Tables</h2>
                <div className="flex flex-wrap gap-2">
                  {dbInfo.databaseInfo.tables.map((table: string) => (
                    <span key={table} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {table}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Table Info */}
            {dbInfo.success && dbInfo.databaseInfo?.contactsTable && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Contacts Table</h2>
                <div className="mb-4">
                  <strong>Total Records:</strong> {dbInfo.databaseInfo.contactsTable.totalRecords}
                </div>
                
                <h3 className="text-lg font-medium mb-2">Table Structure:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Null</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(dbInfo.databaseInfo.contactsTable.structure) ? (
                        // MySQL structure (array of field objects)
                        dbInfo.databaseInfo.contactsTable.structure.map((field: any, index: number) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{field.Field}</td>
                            <td className="border border-gray-300 px-4 py-2">{field.Type}</td>
                            <td className="border border-gray-300 px-4 py-2">{field.Null}</td>
                            <td className="border border-gray-300 px-4 py-2">{field.Key}</td>
                          </tr>
                        ))
                      ) : (
                        // SQLite structure (string description)
                        <tr>
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center text-gray-600">
                            {typeof dbInfo.databaseInfo.contactsTable.structure === 'string' 
                              ? dbInfo.databaseInfo.contactsTable.structure 
                              : 'Database structure information not available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Contacts */}
            {dbInfo.success && dbInfo.databaseInfo?.recentContacts && dbInfo.databaseInfo.recentContacts.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Contacts (Last 5)</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbInfo.databaseInfo.recentContacts.map((contact: any) => (
                        <tr key={contact.id}>
                          <td className="border border-gray-300 px-4 py-2">{contact.id}</td>
                          <td className="border border-gray-300 px-4 py-2">{contact.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{contact.email}</td>
                          <td className="border border-gray-300 px-4 py-2">{contact.subject}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                              contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(contact.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* All Contacts - Detailed View */}
            {showAllContacts && allContacts.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Contacts ({allContacts.length} total)
                  </h2>
                  <button
                    onClick={() => setShowAllContacts(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Hide ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {allContacts.map((contact: any, index: number) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Basic Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              ID: {contact.id}
                            </span>
                            {contact.name}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <div><strong>Email:</strong> 
                              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline ml-1">
                                {contact.email}
                              </a>
                            </div>
                            {contact.company && (
                              <div><strong>Company:</strong> {contact.company}</div>
                            )}
                          </div>
                        </div>

                        {/* Message Info */}
                        <div className="space-y-2">
                          <div><strong>Subject:</strong> {contact.subject}</div>
                          <div><strong>Message:</strong></div>
                          <div className="bg-gray-50 p-2 rounded text-sm max-h-20 overflow-y-auto">
                            {contact.message}
                          </div>
                        </div>

                        {/* Status & Technical Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <strong>Status:</strong>
                            <span className={`px-2 py-1 rounded text-xs ${
                              contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                              contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <div><strong>Created:</strong> {new Date(contact.created_at).toLocaleString()}</div>
                            {contact.updated_at !== contact.created_at && (
                              <div><strong>Updated:</strong> {new Date(contact.updated_at).toLocaleString()}</div>
                            )}
                            {contact.ip_address && (
                              <div><strong>IP:</strong> <code className="bg-gray-100 px-1 rounded">{contact.ip_address}</code></div>
                            )}
                          </div>

                          {/* User Agent (collapsed by default) */}
                          {contact.user_agent && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                <strong>User Agent</strong>
                              </summary>
                              <div className="mt-1 bg-gray-50 p-2 rounded text-xs">
                                {contact.user_agent}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for All Contacts */}
            {showAllContacts && allContacts.length === 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">All Contacts</h2>
                <div className="text-center py-8 text-gray-500">
                  <p>No contacts found in the database.</p>
                  <p className="text-sm mt-2">Try creating some sample data or check if the contact form is working.</p>
                </div>
              </div>
            )}

            {/* Error Details */}
            {!dbInfo.success && dbInfo.details && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Error Details</h2>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-red-800 mb-4">{dbInfo.details}</p>
                  
                  {dbInfo.possibleSolutions && (
                    <>
                      <h3 className="font-semibold text-red-900 mb-2">Possible Solutions:</h3>
                      <ul className="list-disc list-inside text-red-800 space-y-1">
                        {dbInfo.possibleSolutions.map((solution: string, index: number) => (
                          <li key={index}>{solution}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructions</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">1. Install MySQL (if not installed):</h3>
              <code className="block bg-gray-100 p-2 rounded mt-1">./install-mysql.sh</code>
            </div>
            
            <div>
              <h3 className="font-semibold">2. Configure Database:</h3>
              <p>Update your <code>.env.local</code> file with MySQL credentials</p>
            </div>
            
            <div>
              <h3 className="font-semibold">3. Test Connection:</h3>
              <p>Click "Test Database Connection" button above</p>
            </div>
            
            <div>
              <h3 className="font-semibold">4. View Admin Dashboard:</h3>
              <a href="/admin" className="text-blue-600 hover:underline">
                Go to Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

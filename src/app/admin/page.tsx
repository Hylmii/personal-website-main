'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

interface ContactStats {
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  byDate: Array<{ date: string; count: number }>;
  recent: Array<Pick<Contact, 'id' | 'name' | 'email' | 'subject' | 'status' | 'created_at'>>;
  topCompanies: Array<{ company: string; count: number }>;
}

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    setIsAuthenticated(isLoggedIn);
    if (isLoggedIn) {
      fetchContacts();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  // Authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Simple authentication - in production, use proper backend auth
    const ADMIN_USERNAME = 'hylmi'; // Change this to your preferred username
    const ADMIN_PASSWORD = 'admin2024'; // Change this to your secure password

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_logged_in', 'true');
      setIsAuthenticated(true);
      fetchContacts();
      fetchStats();
    } else {
      setLoginError('Invalid username or password');
    }

    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Fetch contacts
  const fetchContacts = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const url = new URL('/api/contacts', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '10');
      if (status) url.searchParams.set('status', status);

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        setContacts(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      } else {
        setError(result.error || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contacts/stats');
      const result = await response.json();

      if (response.ok && result.success) {
        setStats(result.data);
      } else {
        console.error('Failed to fetch stats:', result.error || 'Unknown error');
        
        // Don't show error for missing table - it's expected before first contact
        if (result.error !== 'Contacts table does not exist') {
          setError(`Statistics error: ${result.error || 'Failed to load stats'}`);
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Network error while fetching statistics');
    }
  };

  // Update contact status
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchContacts(currentPage, selectedStatus);
        fetchStats();
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to update status');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchContacts(currentPage, selectedStatus);
        fetchStats();
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to delete contact');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Open detail modal
  const openDetailModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setSelectedContact(null);
    setShowDetailModal(false);
  };

  useEffect(() => {
    fetchContacts(1, selectedStatus);
    fetchStats();
  }, [selectedStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-gray-600">Enter your credentials to access the dashboard</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 space-y-6"
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </div>
          </motion.form>

          <div className="text-center">
            <p className="text-xs text-gray-500 mt-4">
              Secure access to portfolio administration
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin Dashboard</h1>
            <p className="text-gray-600">Manage contact form submissions</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
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

        {/* Statistics Cards */}
        {stats && stats.total > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Contacts</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            
            {stats.byStatus.map((item) => (
              <div key={item.status} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{item.status}</h3>
                <p className="text-3xl font-bold text-green-600">{item.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contacts Yet</h3>
              <p className="text-gray-600">Contact statistics will appear here once you receive your first message.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          
          <button
            onClick={() => fetchContacts(currentPage, selectedStatus)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Contacts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contacts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          {contact.company && (
                            <div className="text-xs text-gray-400">{contact.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{contact.subject}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => openDetailModal(contact)}
                          className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                        >
                          View Detail
                        </button>
                        <select
                          value={contact.status}
                          onChange={(e) => updateStatus(contact.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => fetchContacts(currentPage - 1, selectedStatus)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => fetchContacts(currentPage + 1, selectedStatus)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
                <p className="text-sm text-gray-600">ID: {selectedContact.id}</p>
              </div>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-blue-800">Name:</label>
                        <p className="text-gray-900">{selectedContact.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800">Email:</label>
                        <a 
                          href={`mailto:${selectedContact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.company && (
                        <div>
                          <label className="block text-sm font-medium text-blue-800">Company:</label>
                          <p className="text-gray-900">{selectedContact.company}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-blue-800">Status:</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContact.status)}`}>
                          {selectedContact.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Technical Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created:</label>
                        <p className="text-gray-900">{formatDate(selectedContact.created_at)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Updated:</label>
                        <p className="text-gray-900">{formatDate(selectedContact.updated_at)}</p>
                      </div>
                      {selectedContact.ip_address && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">IP Address:</label>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{selectedContact.ip_address}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Message */}
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3">Message</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-green-800">Subject:</label>
                        <p className="text-gray-900 font-medium">{selectedContact.subject}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-800">Message:</label>
                        <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {selectedContact.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Agent Info */}
                  {selectedContact.user_agent && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-3">Browser Information</h3>
                      <div className="bg-white p-3 rounded border">
                        <code className="text-xs text-gray-600 block break-all">
                          {selectedContact.user_agent}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => {
                      updateStatus(selectedContact.id, e.target.value);
                      setSelectedContact({ ...selectedContact, status: e.target.value as any });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this contact?')) {
                        deleteContact(selectedContact.id);
                        closeDetailModal();
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Contact
                  </button>
                </div>

                <button
                  onClick={closeDetailModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

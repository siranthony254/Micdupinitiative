"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface User {
  id: string
  full_name: string | null
  email: string | null
  role: 'student' | 'admin' | 'editor' | 'writer'
  created_at: string
  last_sign_in_at?: string
  enrollments?: Enrollment[]
  profile?: {
    bio?: string
    avatar_url?: string
    location?: string
    website?: string
  }
}

interface Enrollment {
  id: string
  cohort_id: string
  enrolled_at: string
  status: 'active' | 'completed' | 'dropped'
  progress?: number
  cohort?: {
    name: string
    description: string
  }
}

export default function AdminUsersPage() {
  const { user, profile, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState<User['role']>('student')

  useEffect(() => {
    if (!loading && (!isAdmin || !user)) {
      router.push('/mui-portal/dashboard')
      return
    }

    if (isAdmin && user) {
      fetchUsers()
    }
  }, [isAdmin, user, loading, router])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      
      let query = supabase
        .from('profiles')
        .select(`
          *,
          enrollments (
            id,
            cohort_id,
            enrolled_at,
            status,
            progress,
            cohort:cohorts (
              name,
              description
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const updateUserRole = async (userId: string, role: User['role']) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user role:', error)
        alert('Failed to update user role: ' + error.message)
      } else {
        alert('User role updated successfully!')
        setShowRoleModal(false)
        setSelectedUser(null)
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      // First delete user's enrollments
      await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', userId)

      // Then delete the user's profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user: ' + error.message)
      } else {
        alert('User deleted successfully!')
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const openRoleModal = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">You don't have permission to access this page.</p>
          <Link href="/mui-portal/dashboard" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Manage Users</h1>
          <p className="text-gray-400">View and manage user profiles and permissions</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Users</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
                <option value="editor">Editors</option>
                <option value="writer">Writers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No users found</p>
            <p className="text-gray-500 mt-2">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No users have registered yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {user.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Role</p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-600 text-white' :
                          user.role === 'editor' ? 'bg-blue-600 text-white' :
                          user.role === 'writer' ? 'bg-green-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Member Since</p>
                        <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Sign In</p>
                        <p className="text-white">
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Enrollments */}
                    {user.enrollments && user.enrollments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">
                          Enrollments ({user.enrollments.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.enrollments.map((enrollment) => (
                            <span
                              key={enrollment.id}
                              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                            >
                              {enrollment.cohort?.name || 'Unknown Cohort'}
                              {enrollment.progress && ` (${enrollment.progress}%)`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openRoleModal(user)}
                      className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Change User Role</h3>
              <div className="mb-4">
                <p className="text-gray-400 mb-2">
                  User: <span className="text-white">{selectedUser.full_name || selectedUser.email}</span>
                </p>
                <p className="text-gray-400">
                  Current role: <span className="text-amber-400">{selectedUser.role}</span>
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as User['role'])}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="student">Student</option>
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => updateUserRole(selectedUser.id, newRole)}
                  className="flex-1 px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
                >
                  Update Role
                </button>
                <button
                  onClick={() => {
                    setShowRoleModal(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

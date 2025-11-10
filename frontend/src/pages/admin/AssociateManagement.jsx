import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

const AssociateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [associates, setAssociates] = useState([])
  const [filteredAssociates, setFilteredAssociates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssociates()
  }, [])

  useEffect(() => {
    filterAssociates()
  }, [associates, searchTerm, filterStatus])

  const fetchAssociates = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/users?role=associate', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAssociates(data)
      }
    } catch (error) {
      console.error('Error fetching associates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAssociates = () => {
    let filtered = associates

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status?.toLowerCase() === filterStatus.toLowerCase())
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone?.includes(searchTerm)
      )
    }

    setFilteredAssociates(filtered)
  }

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      })
      
      if (response.ok) {
        toast.success('Associate approved successfully!')
        fetchAssociates()
      } else {
        toast.error('Failed to approve associate')
      }
    } catch (error) {
      console.error('Error approving associate:', error)
      toast.error('Failed to approve associate')
    }
  }

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'INACTIVE' })
      })
      
      if (response.ok) {
        toast.success('Associate rejected')
        fetchAssociates()
      } else {
        toast.error('Failed to reject associate')
      }
    } catch (error) {
      console.error('Error rejecting associate:', error)
      toast.error('Failed to reject associate')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this associate?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        toast.success('Associate deleted successfully!')
        fetchAssociates()
      } else {
        toast.error('Failed to delete associate')
      }
    } catch (error) {
      console.error('Error deleting associate:', error)
      toast.error('Failed to delete associate')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Associate Management</h1>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add Associate
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search associates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiFilter /> More Filters
            </button>
          </div>
        </div>

        {/* Associates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-600">Loading associates...</td>
                </tr>
              ) : filteredAssociates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-600">No associates found</td>
                </tr>
              ) : (
                filteredAssociates.map((associate) => (
                  <tr key={associate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{associate.name}</div>
                      <div className="text-xs text-gray-500">Code: {associate.referralCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{associate.email}</div>
                      <div className="text-sm text-gray-500">{associate.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        associate.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                        associate.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {associate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {associate.status?.toLowerCase() === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(associate.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FiCheckCircle />
                            </button>
                            <button 
                              onClick={() => handleReject(associate.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FiXCircle />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(associate.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssociateManagement

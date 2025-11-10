import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiUsers, FiDollarSign, FiFileText, FiTrendingUp, FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalLeads: 0,
    totalCommissions: 0,
    pendingProperties: 0
  })
  const [pendingProperties, setPendingProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    fetchPendingProperties()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const fetchPendingProperties = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Fetching pending properties with token:', token ? 'Token exists' : 'No token')
      
      const response = await fetch('http://localhost:5000/api/admin/properties/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Pending properties response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Pending properties data:', data)
        setPendingProperties(data)
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (propertyId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        toast.success('Property approved successfully!')
        fetchPendingProperties()
        fetchDashboardData()
      } else {
        toast.error('Failed to approve property')
      }
    } catch (error) {
      console.error('Error approving property:', error)
      toast.error('Failed to approve property')
    }
  }

  const handleReject = async (propertyId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        toast.success('Property rejected')
        fetchPendingProperties()
        fetchDashboardData()
      } else {
        toast.error('Failed to reject property')
      }
    } catch (error) {
      console.error('Error rejecting property:', error)
      toast.error('Failed to reject property')
    }
  }

  const statsDisplay = [
    { label: 'Total Associates', value: stats.totalUsers || 0, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Commissions', value: `₹${(stats.totalCommissions || 0)}`, icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Active Leads', value: stats.totalLeads || 0, icon: FiFileText, color: 'bg-yellow-500' },
    { label: 'Properties Listed', value: stats.totalProperties || 0, icon: FiTrendingUp, color: 'bg-purple-500' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsDisplay.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Property Verification Section */}
        {pendingProperties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Property Verification ({pendingProperties.length} Pending)
            </h2>
            <div className="space-y-4">
              {pendingProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{property.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>📍 {property.city}, {property.state}</span>
                        <span>💰 ₹{property.price?.toLocaleString()}</span>
                        <span>📏 {property.area} sq ft</span>
                        {property.bedrooms && <span>🛏️ {property.bedrooms} BHK</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Listed by: {property.listedByUserName || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(property.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && pendingProperties.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Property Verification</h2>
            <p className="text-gray-600 text-center py-8">No pending properties for verification</p>
          </div>
        )}


      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard

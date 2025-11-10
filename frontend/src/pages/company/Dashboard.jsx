import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiUsers, FiFileText, FiTrendingUp, FiDollarSign } from 'react-icons/fi'

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    teamMembers: 0,
    activeLeads: 0,
    conversions: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/company/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsDisplay = [
    { label: 'Team Members', value: stats.teamMembers || 0, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Active Leads', value: stats.activeLeads || 0, icon: FiFileText, color: 'bg-yellow-500' },
    { label: 'Conversions', value: stats.conversions || 0, icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-purple-500' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
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
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <p className="text-gray-600">Team analytics and performance metrics will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CompanyDashboard

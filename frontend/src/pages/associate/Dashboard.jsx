import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiDollarSign, FiUsers, FiFileText, FiTrendingUp } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AssociateDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEarnings: 0,
    teamMembers: 0,
    activeLeads: 0,
    properties: 0
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    fetchRecentLeads()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch commission summary
      const commissionRes = await fetch('http://localhost:5000/api/commissions/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (commissionRes.ok) {
        const commissionData = await commissionRes.json()
        setStats(prev => ({ ...prev, totalEarnings: commissionData.totalEarnings || 0 }))
      }

      // Fetch team network
      const teamRes = await fetch('http://localhost:5000/api/mlm/network', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setStats(prev => ({ ...prev, teamMembers: teamData.totalMembers || 0 }))
      }

      // Fetch leads count
      const leadsRes = await fetch('http://localhost:5000/api/leads/my-leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        const activeCount = leadsData.filter(l => 
          l.status?.toLowerCase() === 'open' || l.status?.toLowerCase() === 'in-progress'
        ).length
        setStats(prev => ({ ...prev, activeLeads: activeCount }))
      }

      // Fetch properties count
      const propsRes = await fetch('http://localhost:5000/api/properties/my-properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (propsRes.ok) {
        const propsData = await propsRes.json()
        setStats(prev => ({ ...prev, properties: propsData.length }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentLeads = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/leads/my-leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setRecentLeads(data.slice(0, 4)) // Get first 4 leads
      }
    } catch (error) {
      console.error('Error fetching recent leads:', error)
    }
  }

  const statsDisplay = [
    { label: 'Total Earnings', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Team Members', value: stats.teamMembers, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Active Leads', value: stats.activeLeads, icon: FiFileText, color: 'bg-yellow-500' },
    { label: 'My Properties', value: stats.properties, icon: FiTrendingUp, color: 'bg-purple-500' }
  ]

  const earningsData = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: stats.totalEarnings }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-8 text-gray-600">Loading...</div>
          ) : (
            statsDisplay.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              )
            })
          )}
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/associate/add-property')}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Add New Property
              </button>
              <button 
                onClick={() => navigate('/associate/team-network')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                View Team Network
              </button>
              <button 
                onClick={() => navigate('/associate/commission-earnings')}
                className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700"
              >
                View Commission Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Leads</h2>
              <button 
                onClick={() => navigate('/associate/lead-management')}
                className="text-primary text-sm hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentLeads.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No leads yet</p>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{lead.customerName}</p>
                      <p className="text-sm text-gray-600">{lead.propertyRequirement || 'No requirement specified'}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lead.status?.toLowerCase() === 'open' ? 'bg-blue-100 text-blue-800' :
                      lead.status?.toLowerCase() === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status?.toLowerCase() === 'won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssociateDashboard

import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiDollarSign, FiTrendingUp, FiDownload } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CommissionEarnings = () => {
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0
  })
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommissionData()
  }, [])

  const fetchCommissionData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch summary
      const summaryRes = await fetch('http://localhost:5000/api/commissions/earnings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }

      // Fetch commission list
      const commissionsRes = await fetch('http://localhost:5000/api/commissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json()
        setCommissions(commissionsData)
      }
    } catch (error) {
      console.error('Error fetching commission data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group commissions by month for chart
  const getMonthlyData = () => {
    const monthlyMap = {}
    commissions.forEach(comm => {
      if (comm.createdAt) {
        const month = new Date(comm.createdAt).toLocaleDateString('en-US', { month: 'short' })
        if (!monthlyMap[month]) {
          monthlyMap[month] = { month, direct: 0, network: 0, bonus: 0 }
        }
        // Categorize by level
        if (comm.level === 1) monthlyMap[month].direct += comm.amount
        else if (comm.level <= 3) monthlyMap[month].network += comm.amount
        else monthlyMap[month].bonus += comm.amount
      }
    })
    return Object.values(monthlyMap).slice(-6) // Last 6 months
  }

  const earningsData = getMonthlyData()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Commission & Earnings</h1>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiDownload /> Download Report
          </button>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign size={32} />
                <span className="text-sm opacity-90">Paid Earnings</span>
              </div>
              <p className="text-3xl font-bold">₹{summary.paidEarnings?.toLocaleString() || 0}</p>
              <p className="text-sm opacity-90 mt-1">Successfully paid</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp size={32} />
                <span className="text-sm opacity-90">Total Earned</span>
              </div>
              <p className="text-3xl font-bold">₹{summary.totalEarnings?.toLocaleString() || 0}</p>
              <p className="text-sm opacity-90 mt-1">Lifetime earnings</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign size={32} />
                <span className="text-sm opacity-90">Pending</span>
              </div>
              <p className="text-3xl font-bold">₹{summary.pendingEarnings?.toLocaleString() || 0}</p>
              <p className="text-sm opacity-90 mt-1">To be processed</p>
            </div>
          </div>
        )}

        {/* Earnings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Earnings Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="direct" fill="#1e40af" name="Direct Commission" />
              <Bar dataKey="network" fill="#10b981" name="Network Commission" />
              <Bar dataKey="bonus" fill="#f59e0b" name="Bonuses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-600">Loading commissions...</td>
                  </tr>
                ) : commissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-600">No commissions yet</td>
                  </tr>
                ) : (
                  commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        Level {commission.level} Commission
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {commission.description || 'Commission earned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                        ₹{commission.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          commission.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 
                          commission.status?.toLowerCase() === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CommissionEarnings

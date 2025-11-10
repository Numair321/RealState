import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiUsers, FiUserPlus, FiTrendingUp, FiDollarSign, FiCopy } from 'react-icons/fi'
import { toast } from 'react-toastify'

const TeamNetwork = () => {
  const [stats, setStats] = useState({
    directReferrals: 0,
    totalMembers: 0,
    activeMembers: 0,
    networkEarnings: 0
  })
  const [referralLink, setReferralLink] = useState('')
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNetworkData()
  }, [])

  const fetchNetworkData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch network stats
      const statsRes = await fetch('http://localhost:5000/api/mlm/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch referral link
      const linkRes = await fetch('http://localhost:5000/api/mlm/referral-link', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (linkRes.ok) {
        const linkData = await linkRes.json()
        setReferralLink(linkData.referralLink || '')
      }

      // Fetch direct referrals
      const membersRes = await fetch('http://localhost:5000/api/mlm/referrals', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (membersRes.ok) {
        const membersData = await membersRes.json()
        setTeamMembers(membersData)
      }
    } catch (error) {
      console.error('Error fetching network data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied to clipboard!')
  }

  const networkStatsDisplay = [
    { label: 'Direct Referrals', value: stats.directReferrals || 0, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Network', value: stats.totalMembers || 0, icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Active Members', value: stats.activeMembers || 0, icon: FiUserPlus, color: 'bg-yellow-500' },
    { label: 'Network Earnings', value: `₹${(stats.networkEarnings || 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-purple-500' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiUserPlus /> Invite Member
          </button>
        </div>

        {/* Network Stats */}
        {loading ? (
          <div className="text-center py-8">Loading network data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {networkStatsDisplay.map((stat, index) => {
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

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">Your Referral Link</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={referralLink || 'Loading...'}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button 
              onClick={copyReferralLink}
              disabled={!referralLink}
              className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
            >
              <FiCopy /> Copy Link
            </button>
          </div>
          <p className="mt-3 text-sm opacity-90">Share this link to invite new associates and earn commissions</p>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">Loading team members...</td>
                  </tr>
                ) : teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                      No team members yet. Share your referral link to build your network!
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Direct Referral
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
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

export default TeamNetwork

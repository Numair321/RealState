import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiSave } from 'react-icons/fi'
import { toast } from 'react-toastify'

const CommissionConfig = () => {
  const [config, setConfig] = useState({
    level1: 2.0,
    level2: 1.0,
    level3: 0.5,
    level4: 0.25,
    level5: 0.15,
    referralBonus: 5000,
    milestoneBonus: 10000
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/commission-config', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading config:', error)
      toast.error('Failed to load commission configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/commission-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast.success('Commission configuration saved successfully!')
      } else {
        toast.error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading configuration...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Commission Configuration</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Multi-Level Commission Rates</h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Level {level} Commission</h3>
                  <p className="text-sm text-gray-600">Commission for level {level} referrals</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={config[`level${level}`]}
                    onChange={(e) => setConfig({ ...config, [`level${level}`]: parseFloat(e.target.value) })}
                  />
                  <span className="text-gray-600">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Bonus Configuration</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Referral Bonus</h3>
                <p className="text-sm text-gray-600">One-time bonus for new associate referral</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={config.referralBonus}
                  onChange={(e) => setConfig({ ...config, referralBonus: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Milestone Bonus</h3>
                <p className="text-sm text-gray-600">Bonus for achieving team milestones</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={config.milestoneBonus}
                  onChange={(e) => setConfig({ ...config, milestoneBonus: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <FiSave /> Save Configuration
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CommissionConfig

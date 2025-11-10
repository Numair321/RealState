import DashboardLayout from '../../layouts/DashboardLayout'
import { FiHeart, FiSearch, FiBell } from 'react-icons/fi'

const CustomerDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <FiHeart className="text-red-500 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">Saved Properties</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <FiSearch className="text-blue-500 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">Saved Searches</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <FiBell className="text-yellow-500 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">New Matches</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your recent property views and interactions will appear here.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CustomerDashboard

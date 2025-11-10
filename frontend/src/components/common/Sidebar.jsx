import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiUsers, FiDollarSign, FiFileText, FiSettings, FiTrendingUp, FiGrid, FiUser } from 'react-icons/fi'

const Sidebar = ({ role }) => {
  const location = useLocation()

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin', icon: FiHome, label: 'Dashboard' },
          { path: '/admin/associates', icon: FiUsers, label: 'Associates' },
          { path: '/admin/leads', icon: FiFileText, label: 'Leads' },
          { path: '/admin/commissions', icon: FiDollarSign, label: 'Commissions' },
          { path: '/admin/profile', icon: FiUser, label: 'Profile' },
          { path: '/admin/settings', icon: FiSettings, label: 'Settings' }
        ]
      case 'associate':
        return [
          { path: '/associate', icon: FiHome, label: 'Dashboard' },
          { path: '/associate/leads', icon: FiFileText, label: 'My Leads' },
          { path: '/associate/properties', icon: FiGrid, label: 'Properties' },
          { path: '/associate/team', icon: FiUsers, label: 'My Network' },
          { path: '/associate/earnings', icon: FiDollarSign, label: 'Earnings' },
          { path: '/associate/profile', icon: FiUser, label: 'Profile' },
          { path: '/associate/settings', icon: FiSettings, label: 'Settings' }
        ]
      case 'company':
        return [
          { path: '/company', icon: FiHome, label: 'Dashboard' },
          { path: '/company/team', icon: FiUsers, label: 'Team' },
          { path: '/company/analytics', icon: FiTrendingUp, label: 'Analytics' },
          { path: '/company/profile', icon: FiUser, label: 'Profile' },
          { path: '/company/settings', icon: FiSettings, label: 'Settings' }
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold capitalize">{role} Panel</h2>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'admin': return '/admin'
      case 'associate': return '/associate'
      case 'company': return '/company'
      case 'customer': return '/customer'
      default: return '/'
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.PNG" alt="InvestorsDeaal" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-primary">InvestorsDeaal</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties" className="text-gray-700 hover:text-primary font-medium">Buy</Link>
            <Link to="/properties?type=rent" className="text-gray-700 hover:text-primary font-medium">Rent</Link>
            <Link to="/properties?category=hot-deals" className="text-gray-700 hover:text-primary font-medium">Hot Deals</Link>
            <Link to="/properties?type=commercial" className="text-gray-700 hover:text-primary font-medium">Commercial</Link>
            
            {user ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-primary font-medium">
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  Post Property Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/properties" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Properties</Link>
            <Link to="/properties?category=hot-deals" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Hot Deals</Link>
            {user ? (
              <>
                <Link to={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

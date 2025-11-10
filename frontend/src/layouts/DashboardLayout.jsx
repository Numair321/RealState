import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'

const DashboardLayout = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

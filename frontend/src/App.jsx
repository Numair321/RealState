import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AssociateManagement from './pages/admin/AssociateManagement'
import CommissionConfig from './pages/admin/CommissionConfig'
import LeadOversight from './pages/admin/LeadOversight'

// Associate Pages
import AssociateDashboard from './pages/associate/Dashboard'
import LeadManagement from './pages/associate/LeadManagement'
import TeamNetwork from './pages/associate/TeamNetwork'
import CommissionEarnings from './pages/associate/CommissionEarnings'
import PropertyListings from './pages/associate/PropertyListings'

// Company Pages
import CompanyDashboard from './pages/company/Dashboard'
import TeamManagement from './pages/company/TeamManagement'

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard'
import PropertySearch from './pages/customer/PropertySearch'
import PropertyDetails from './pages/customer/PropertyDetails'
import Properties from './pages/customer/Properties'

// Common Pages
import Home from './pages/Home'
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFound from './pages/NotFound'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import FAQ from './pages/FAQ'
import Profile from './pages/common/Profile'
import Settings from './pages/common/Settings'
import AddProperty from './pages/associate/AddProperty'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="associates" element={<AssociateManagement />} />
            <Route path="commissions" element={<CommissionConfig />} />
            <Route path="leads" element={<LeadOversight />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Associate Routes */}
          <Route path="/associate" element={<ProtectedRoute allowedRoles={['associate']} />}>
            <Route index element={<AssociateDashboard />} />
            <Route path="leads" element={<LeadManagement />} />
            <Route path="team" element={<TeamNetwork />} />
            <Route path="earnings" element={<CommissionEarnings />} />
            <Route path="properties" element={<PropertyListings />} />
            <Route path="properties/add" element={<AddProperty />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Company Routes */}
          <Route path="/company" element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer', 'buyer', 'seller']} />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

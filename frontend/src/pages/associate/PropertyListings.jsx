import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'

const PropertyListings = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyProperties()
  }, [])

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/properties/my-properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        toast.success('Property deleted successfully!')
        fetchMyProperties()
      } else {
        toast.error('Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Property Listings</h1>
          <Link to="/associate/properties/add" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiPlus /> Add Property
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">You haven't added any properties yet</p>
            <Link to="/associate/add-property" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${property.images[0]}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                      {property.propertyType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{property.title}</h3>
                  <p className="text-xl font-bold text-primary mb-3">₹{property.price?.toLocaleString()}</p>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{property.views || 0} views</span>
                    <span>{property.leads || 0} leads</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <FiEye /> View
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="py-2 px-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PropertyListings

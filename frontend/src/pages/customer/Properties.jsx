import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { FiSearch, FiMapPin, FiHome, FiMaximize2, FiFilter } from 'react-icons/fi'

const Properties = () => {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    listingType: searchParams.get('type') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    isHotDeal: searchParams.get('category') === 'hot-deals',
    searchTerm: ''
  })

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.listingType, filters.propertyType, filters.city, filters.isHotDeal])

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      listingType: searchParams.get('type') || '',
      propertyType: searchParams.get('propertyType') || '',
      city: searchParams.get('city') || '',
      isHotDeal: searchParams.get('category') === 'hot-deals',
      searchTerm: ''
    })
  }, [searchParams])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('status', 'approved')
      
      if (filters.listingType) params.append('listingType', filters.listingType)
      if (filters.propertyType) params.append('propertyType', filters.propertyType)
      if (filters.city) params.append('city', filters.city)
      if (filters.isHotDeal) params.append('isHotDeal', 'true')

      const response = await fetch(`http://localhost:5000/api/properties?${params.toString()}`)
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      listingType: '',
      propertyType: '',
      city: '',
      isHotDeal: false,
      searchTerm: ''
    })
  }

  const filteredProperties = properties.filter(property => {
    if (!filters.searchTerm) return true
    const searchLower = filters.searchTerm.toLowerCase()
    return (
      property.title?.toLowerCase().includes(searchLower) ||
      property.city?.toLowerCase().includes(searchLower) ||
      property.location?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.isHotDeal ? '🔥 Hot Deals' : 
             filters.listingType === 'rent' ? 'Properties for Rent' :
             filters.listingType === 'sale' ? 'Properties for Sale' :
             'All Properties'}
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, city..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.listingType}
                onChange={(e) => handleFilterChange('listingType', e.target.value)}
              >
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="land">Land/Plot</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isHotDeal}
                onChange={(e) => handleFilterChange('isHotDeal', e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">🔥 Hot Deals Only</span>
            </label>
            
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading properties...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-600 text-lg mb-2">No properties found</div>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
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
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  {property.isHotDeal && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 HOT DEAL
                    </div>
                  )}
                  {property.isFeatured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                      {property.propertyType}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FiMapPin size={14} className="mr-1" />
                    <span className="line-clamp-1">{property.city}, {property.state}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pb-3 border-b">
                    <div className="flex items-center">
                      <FiHome size={14} className="mr-1" />
                      <span>{property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMaximize2 size={14} className="mr-1" />
                      <span>{property.area} sq ft</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-2xl font-bold text-primary">₹{property.price?.toLocaleString()}</span>
                    <span className="text-primary text-sm font-semibold">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 InvestorsDeaal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Properties

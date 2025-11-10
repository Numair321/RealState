import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
import { FiSearch, FiMapPin, FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const PropertySearch = () => {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceMin: '',
    priceMax: ''
  })

  const properties = [
    { id: 1, title: '3BHK Apartment in Noida Sector 63', location: 'Noida', type: 'Residential', price: '₹85 Lakhs', image: '' },
    { id: 2, title: 'Commercial Space in Ghaziabad', location: 'Ghaziabad', type: 'Commercial', price: '₹1.2 Cr', image: '' },
    { id: 3, title: 'Villa in Greater Noida', location: 'Greater Noida', type: 'Residential', price: '₹2.5 Cr', image: '' },
    { id: 4, title: 'Plot in Noida Extension', location: 'Noida', type: 'Land', price: '₹45 Lakhs', image: '' },
    { id: 5, title: 'Office Space in Delhi', location: 'Delhi', type: 'Commercial', price: '₹3.5 Cr', image: '' },
    { id: 6, title: '2BHK Flat in Gurgaon', location: 'Gurgaon', type: 'Residential', price: '₹65 Lakhs', image: '' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Properties</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
            <input
              type="text"
              placeholder="Min Price"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            />
            <input
              type="text"
              placeholder="Max Price"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
            />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{property.type}</span>
                  <button className="text-gray-400 hover:text-red-500">
                    <FiHeart size={20} />
                  </button>
                </div>
                <h3 className="font-semibold mb-2">{property.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FiMapPin size={16} className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary">{property.price}</p>
                  <Link to={`/property/${property.id}`} className="text-primary hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertySearch

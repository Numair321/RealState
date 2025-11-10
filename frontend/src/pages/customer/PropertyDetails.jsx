import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { FiMapPin, FiHome, FiMaximize2, FiPhone, FiMail, FiDollarSign } from 'react-icons/fi'

const PropertyDetails = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPropertyDetails()
  }, [id])

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Property not found</p>
        </div>
      </div>
    )
  }

  const pricePerSqFt = property.area ? (property.price / property.area).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Property Images */}
          <div className="h-96 bg-gray-200 relative">
            {property.images && property.images.length > 0 ? (
              <img 
                src={`http://localhost:5000${property.images[0]}`}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23ddd" width="800" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xl">No Image Available</span>
              </div>
            )}
          </div>
          
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{property.location}, {property.city}, {property.state}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">₹{property.price?.toLocaleString()}</p>
                {property.area && <p className="text-gray-600">₹{pricePerSqFt}/sq ft</p>}
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b">
              <div className="flex items-center gap-3">
                <FiHome className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold capitalize">{property.propertyType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMaximize2 className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">{property.area} sq ft</p>
                </div>
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <FiHome className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms} BHK</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <FiHome className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description || 'No description available'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiPhone className="text-primary" />
                  <span>{property.ownerPhone}</span>
                </div>
                {property.ownerEmail && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiMail className="text-primary" />
                    <span>{property.ownerEmail}</span>
                  </div>
                )}
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FiPhone /> Contact: {property.ownerName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails

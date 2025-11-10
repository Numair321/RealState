import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { FiSearch, FiTrendingUp, FiUsers, FiDollarSign, FiMapPin, FiHome, FiMaximize2 } from 'react-icons/fi'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovedProperties()
  }, [])

  const fetchApprovedProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties?status=approved')
      if (response.ok) {
        const data = await response.json()
        // Show all approved properties, not just 4
        setFeaturedProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white py-32" style={{ backgroundImage: 'url(/image.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Find Your Perfect Property in India</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">Buy, Sell, or Rent properties with India's most trusted real estate platform</p>
            
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter city, locality"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Land/Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900">
                    <option>Any Budget</option>
                    <option>Under 50 Lakhs</option>
                    <option>50L - 1 Cr</option>
                    <option>1 Cr - 2 Cr</option>
                    <option>Above 2 Cr</option>
                  </select>
                </div>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <FiSearch /> Search Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Properties by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/properties?type=apartment" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="font-semibold text-lg">Apartments</h3>
              <p className="text-sm text-gray-600 mt-1">1,234+ properties</p>
            </Link>
            <Link to="/properties?type=villa" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🏡</div>
              <h3 className="font-semibold text-lg">Villas</h3>
              <p className="text-sm text-gray-600 mt-1">567+ properties</p>
            </Link>
            <Link to="/properties?type=commercial" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="font-semibold text-lg">Commercial</h3>
              <p className="text-sm text-gray-600 mt-1">890+ properties</p>
            </Link>
            <Link to="/properties?type=land" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🌳</div>
              <h3 className="font-semibold text-lg">Land/Plots</h3>
              <p className="text-sm text-gray-600 mt-1">456+ properties</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Deals Banner */}
      <section className="py-4 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-lg">Hot Deals - Limited Time Offers!</span>
            <Link to="/properties?category=hot-deals" className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
              View All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link to="/properties" className="text-primary font-semibold hover:underline">
              View All Properties →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-8 text-gray-600">Loading properties...</div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-4 text-center py-8 text-gray-600">No approved properties yet</div>
            ) : (
              featuredProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
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
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                        {property.propertyType || property.type}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                        {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{property.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FiMapPin size={14} className="mr-1" />
                      <span>{property.city}, {property.state}</span>
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose InvestorsDeaal</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-primary" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Listings</h3>
              <p className="text-gray-600">All properties are verified by our team</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-green-600" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing and exclusive deals</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-purple-600" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">MLM Network</h3>
              <p className="text-gray-600">Build your team and earn commissions</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="text-yellow-600" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn More</h3>
              <p className="text-gray-600">Multiple income streams for associates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become Associate Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Become a Real Estate Associate</h2>
              <p className="text-xl mb-6 text-blue-100">Join our MLM network and start earning commissions on every deal</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold">✓</span>
                  <span>Earn up to 2% commission on property deals</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold">✓</span>
                  <span>Build your team and earn from their sales</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold">✓</span>
                  <span>Multi-level commission structure (5 levels)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold">✓</span>
                  <span>Free training and marketing support</span>
                </li>
              </ul>
              <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 inline-block text-lg">
                Join as Associate - Free
              </Link>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold mb-2">1,234+</div>
                  <div className="text-blue-100">Active Associates</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">₹12.5L</div>
                  <div className="text-blue-100">Avg. Monthly Earnings</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">5,678</div>
                  <div className="text-blue-100">Properties Sold</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-blue-100">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InvestorsDeaal</h3>
              <p className="text-gray-400">India's most trusted real estate platform with MLM opportunities</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/properties" className="hover:text-white">Buy Property</Link></li>
                <li><Link to="/properties?type=rent" className="hover:text-white">Rent Property</Link></li>
                <li><Link to="/properties?category=hot-deals" className="hover:text-white">Hot Deals</Link></li>
                <li><Link to="/register" className="hover:text-white">Post Property</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/register" className="hover:text-white">Become Associate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li>Email: info@investorsdeaal.com</li>
                <li>Phone: +91 9876543210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 InvestorsDeaal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

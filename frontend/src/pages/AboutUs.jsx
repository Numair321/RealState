import Navbar from '../components/common/Navbar'
import { FiUsers, FiTrendingUp, FiAward, FiTarget } from 'react-icons/fi'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About InvestorsDeaal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            India's most trusted real estate platform connecting buyers, sellers, and associates through innovative MLM technology
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 rounded-lg p-8">
            <FiTarget className="text-primary mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To revolutionize the real estate industry in India by providing a transparent, efficient, and rewarding platform 
              for property transactions while empowering individuals through our MLM network.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-8">
            <FiAward className="text-green-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To become India's largest real estate network, creating opportunities for thousands of associates 
              while making property buying and selling seamless for everyone.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,234+</div>
              <div className="text-blue-100">Active Associates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5,678</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3,456</div>
              <div className="text-blue-100">Successful Deals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">₹500Cr+</div>
              <div className="text-blue-100">Transaction Value</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-primary" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Network</h3>
              <p className="text-gray-600">
                Verified associates and properties ensuring safe and secure transactions
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-green-600" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">MLM Opportunity</h3>
              <p className="text-gray-600">
                Build your team and earn commissions on every level of your network
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-purple-600" size={36} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Service</h3>
              <p className="text-gray-600">
                Dedicated support team and training for all our associates
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Leadership</h2>
          <p className="text-gray-600 mb-8">Led by experienced professionals in real estate and technology</p>
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Mr. Manish Tiwari</h3>
            <p className="text-gray-600 mb-2">Founder & CEO</p>
            <p className="text-sm text-gray-500">
              20+ years of experience in real estate and business development
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 InvestorsDeaal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs

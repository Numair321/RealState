import Navbar from '../components/common/Navbar'

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using InvestorsDeaal platform, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Registration</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of the platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Property Listings</h2>
            <p className="text-gray-700 mb-4">
              Users posting property listings agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and truthful information about properties</li>
              <li>Have legal authority to list the property</li>
              <li>Not post misleading or fraudulent listings</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. MLM Associate Program</h2>
            <p className="text-gray-700 mb-4">
              Associates participating in our MLM program agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Follow ethical business practices</li>
              <li>Not make false claims about earnings or opportunities</li>
              <li>Comply with commission structure and payment terms</li>
              <li>Maintain professional conduct with clients</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Commission and Payments</h2>
            <p className="text-gray-700 mb-4">
              Commission payments are subject to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Successful completion of property transactions</li>
              <li>Verification of all transaction details</li>
              <li>Compliance with platform policies</li>
              <li>Payment processing timelines as specified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">
              Users must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Post false or misleading information</li>
              <li>Engage in fraudulent activities</li>
              <li>Harass or abuse other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to manipulate the commission system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on InvestorsDeaal, including text, graphics, logos, and software, is the property of 
              InvestorsDeaal and protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              InvestorsDeaal is not liable for any indirect, incidental, special, or consequential damages 
              arising from your use of the platform or any property transactions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend your account at any time for violation of these terms 
              or for any other reason at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued use of the platform after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms & Conditions, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: legal@investorsdeaal.com<br />
              Phone: +91 9876543210
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 InvestorsDeaal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default TermsConditions

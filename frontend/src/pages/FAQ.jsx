import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is InvestorsDeaal?',
          a: 'InvestorsDeaal is India\'s leading real estate platform that connects property buyers, sellers, and associates through an innovative MLM (Multi-Level Marketing) network. We provide a transparent and efficient platform for property transactions.'
        },
        {
          q: 'How do I register on the platform?',
          a: 'Click on the "Join Now" or "Register" button, fill in your details, select your role (Buyer, Seller, Associate, or Company), and submit. You\'ll receive a confirmation email to activate your account.'
        },
        {
          q: 'Is the platform free to use?',
          a: 'Yes, registration and basic property browsing are completely free. Associates may need to complete verification to access advanced features.'
        }
      ]
    },
    {
      category: 'For Buyers',
      questions: [
        {
          q: 'How do I search for properties?',
          a: 'Use our advanced search feature on the homepage. Filter by location, property type, budget, and amenities to find your perfect property.'
        },
        {
          q: 'Are all properties verified?',
          a: 'Yes, all properties listed on our platform go through a verification process to ensure authenticity and accuracy of information.'
        },
        {
          q: 'How do I contact the property owner?',
          a: 'Click on any property listing and use the "Contact Agent" button to connect with the associate handling that property.'
        }
      ]
    },
    {
      category: 'For Sellers',
      questions: [
        {
          q: 'How do I list my property?',
          a: 'Register as a Seller, go to your dashboard, and click "Post Property". Fill in all property details, upload images, and submit for verification.'
        },
        {
          q: 'Is there a fee for listing properties?',
          a: 'Basic property listing is free. Premium listings with enhanced visibility may have nominal charges.'
        },
        {
          q: 'How long does verification take?',
          a: 'Property verification typically takes 24-48 hours. You\'ll receive an email once your property is approved and live.'
        }
      ]
    },
    {
      category: 'For Associates',
      questions: [
        {
          q: 'What is the MLM program?',
          a: 'Our MLM program allows associates to earn commissions not only from their direct sales but also from their team\'s sales across multiple levels (up to 5 levels).'
        },
        {
          q: 'How much commission can I earn?',
          a: 'Commission rates vary by level: Level 1 (2%), Level 2 (1%), Level 3 (0.5%), Level 4 (0.25%), Level 5 (0.15%). Plus referral bonuses for bringing new associates.'
        },
        {
          q: 'How do I build my team?',
          a: 'Share your unique referral link with potential associates. When they register using your link, they become part of your network.'
        },
        {
          q: 'When do I receive my commission?',
          a: 'Commissions are processed after successful property transactions and verification. Payments are typically made within 7-10 business days.'
        },
        {
          q: 'Is there any training provided?',
          a: 'Yes, we provide comprehensive training materials, webinars, and support to help you succeed as an associate.'
        }
      ]
    },
    {
      category: 'Payments & Transactions',
      questions: [
        {
          q: 'What payment methods are accepted?',
          a: 'We accept bank transfers, UPI, credit/debit cards, and digital wallets for premium services and transactions.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard encryption and secure payment gateways to protect your financial information.'
        },
        {
          q: 'Can I get a refund?',
          a: 'Refund policies vary by service. Please refer to our Terms & Conditions or contact support for specific cases.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions to reset your password.'
        },
        {
          q: 'How do I update my profile information?',
          a: 'Log in to your account, go to Settings > Profile, make your changes, and click Save.'
        },
        {
          q: 'Who do I contact for technical issues?',
          a: 'Email us at support@investorsdeaal.com or call +91 9876543210 for immediate assistance.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about InvestorsDeaal
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === index
                  
                  return (
                    <div key={questionIndex} className="bg-white border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <FiChevronUp className="text-primary flex-shrink-0" size={20} />
                        ) : (
                          <FiChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Contact Support
          </a>
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

export default FAQ

import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FiSearch, FiFilter, FiPhone, FiMail, FiEdit, FiX, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'

const LeadManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    propertyRequirement: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    source: 'WEBSITE',
    notes: ''
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, activeTab, searchTerm, priorityFilter])

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/leads/my-leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(lead => lead.status?.toLowerCase() === activeTab)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.customerPhone?.includes(searchTerm) ||
        lead.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(lead => lead.priority?.toLowerCase() === priorityFilter)
    }

    setFilteredLeads(filtered)
  }

  const getLeadCounts = () => {
    return {
      all: leads.length,
      open: leads.filter(l => l.status?.toLowerCase() === 'open').length,
      'in-progress': leads.filter(l => l.status?.toLowerCase() === 'in-progress').length,
      won: leads.filter(l => l.status?.toLowerCase() === 'won').length,
      lost: leads.filter(l => l.status?.toLowerCase() === 'lost').length
    }
  }

  const counts = getLeadCounts()
  const tabs = [
    { id: 'all', label: 'All Leads', count: counts.all },
    { id: 'open', label: 'Open', count: counts.open },
    { id: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
    { id: 'won', label: 'Won', count: counts.won },
    { id: 'lost', label: 'Lost', count: counts.lost }
  ]

  const handleAddLead = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success('Lead added successfully!')
        setShowAddModal(false)
        resetForm()
        fetchLeads()
      } else {
        toast.error('Failed to add lead')
      }
    } catch (error) {
      console.error('Error adding lead:', error)
      toast.error('Failed to add lead')
    }
  }

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        toast.success('Status updated successfully!')
        fetchLeads()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setFormData({
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      customerEmail: lead.customerEmail,
      propertyRequirement: lead.propertyRequirement,
      status: lead.status,
      priority: lead.priority,
      source: lead.source || 'WEBSITE',
      notes: lead.notes || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateLead = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success('Lead updated successfully!')
        setShowEditModal(false)
        resetForm()
        fetchLeads()
      } else {
        toast.error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      toast.error('Failed to update lead')
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      propertyRequirement: '',
      status: 'OPEN',
      priority: 'MEDIUM',
      source: 'WEBSITE',
      notes: ''
    })
    setSelectedLead(null)
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'won': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> Add Lead
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No leads found</div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{lead.customerName}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                        lead.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{lead.propertyRequirement || lead.propertyTitle || 'No property specified'}</p>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiPhone size={16} />
                        <span>{lead.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail size={16} />
                        <span>{lead.customerEmail}</span>
                      </div>
                    </div>
                    {lead.notes && (
                      <p className="mt-2 text-sm text-gray-600">Notes: {lead.notes}</p>
                    )}
                    <div className="mt-3 flex gap-6 text-sm">
                      {lead.lastContactDate && (
                        <div>
                          <span className="text-gray-600">Last Contact:</span>
                          <span className="ml-2 font-medium">{new Date(lead.lastContactDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {lead.nextFollowupDate && (
                        <div>
                          <span className="text-gray-600">Next Follow-up:</span>
                          <span className="ml-2 font-medium text-blue-600">{new Date(lead.nextFollowupDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditLead(lead)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit size={20} />
                    </button>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Lead Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{showEditModal ? 'Edit Lead' : 'Add New Lead'}</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={showEditModal ? handleUpdateLead : handleAddLead} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="WEBSITE">Website</option>
                      <option value="REFERRAL">Referral</option>
                      <option value="DIRECT">Direct</option>
                      <option value="SOCIAL_MEDIA">Social Media</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Requirement</label>
                  <input
                    type="text"
                    value={formData.propertyRequirement}
                    onChange={(e) => setFormData({...formData, propertyRequirement: e.target.value})}
                    placeholder="e.g., 3 BHK in Noida Sector 62"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  >
                    {showEditModal ? 'Update Lead' : 'Add Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default LeadManagement

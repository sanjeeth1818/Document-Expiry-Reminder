import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import './App.css';

// SVG Icons
const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
  ),
  Documents: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
  ),
  People: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  BellOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="m2 2 20 20"/><path d="M10.3 4.3a6 6 0 0 1 7.7 7.7"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Renew: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
};

function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'documents', 'people'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State
  const [persons, setPersons] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Filter States
  const [selectedPersonFilter, setSelectedPersonFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modals visibility
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);

  // Active Selected item (for edit/renew operations)
  const [currentPerson, setCurrentPerson] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);

  // Form inputs
  const [personForm, setPersonForm] = useState({ name: '', email: '', relationship: '' });
  const [docForm, setDocForm] = useState({
    personId: '',
    docName: '',
    docNumber: '',
    expiryDate: '',
    reminderStartDate: '',
    sendToPerson: true,
    sendToUser: true,
    customRecipients: [],
    tempEmail: ''
  });
  const [renewForm, setRenewForm] = useState({ expiryDate: '', reminderStartDate: '' });

  // Load Initial Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedPersons = await api.getPersons();
      const fetchedDocs = await api.getDocuments();
      setPersons(fetchedPersons);
      setDocuments(fetchedDocs);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toast Notification handler
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Trigger Daily Cron Check Manually
  const handleTriggerScan = async () => {
    try {
      showToast('Scanning database and sending pending reminders...', 'info');
      const res = await api.triggerReminders();
      showToast(`Scan complete! Reminders Sent: ${res.result.sent}, Failed: ${res.result.failed}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Trigger single email reminder manually
  const handleSendSingleEmail = async (docId, docName) => {
    try {
      showToast(`Sending reminder email for ${docName}...`, 'info');
      const res = await api.sendManualEmail(docId);
      showToast(`Email sent successfully!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle Mute Toggle
  const handleToggleMute = async (doc) => {
    try {
      const nextMuted = !doc.isMuted;
      await api.muteDocument(doc._id, nextMuted);
      showToast(nextMuted ? `Muted reminders for ${doc.docName}` : `Enabled reminders for ${doc.docName}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Person CRUD Submit
  const handlePersonSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPerson) {
        await api.updatePerson(currentPerson._id, personForm);
        showToast('Person details updated successfully!');
      } else {
        await api.createPerson(personForm);
        showToast('New person added successfully!');
      }
      setShowPersonModal(false);
      setCurrentPerson(null);
      setPersonForm({ name: '', email: '', relationship: '' });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Document CRUD Submit
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.personId) {
      showToast('Please select a person', 'error');
      return;
    }
    try {
      if (currentDoc) {
        await api.updateDocument(currentDoc._id, docForm);
        showToast('Document updated successfully!');
      } else {
        await api.createDocument(docForm);
        showToast('New document tracker added!');
      }
      setShowDocModal(false);
      setCurrentDoc(null);
      resetDocForm();
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const resetDocForm = () => {
    setDocForm({
      personId: '',
      docName: '',
      docNumber: '',
      expiryDate: '',
      reminderStartDate: '',
      sendToPerson: true,
      sendToUser: true,
      customRecipients: [],
      tempEmail: ''
    });
  };

  // Document Renew Submit
  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.renewDocument(currentDoc._id, renewForm);
      showToast(`${currentDoc.docName} renewed successfully! Reminders updated.`);
      setShowRenewModal(false);
      setCurrentDoc(null);
      setRenewForm({ expiryDate: '', reminderStartDate: '' });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Deletions
  const handleDeletePerson = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will delete all of their associated documents and reminders!`)) {
      try {
        await api.deletePerson(id);
        showToast(`Deleted ${name} and their trackers.`);
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleDeleteDoc = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the tracker for ${name}?`)) {
      try {
        await api.deleteDocument(id);
        showToast(`Deleted ${name} tracker.`);
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Helper to trigger Renew modal
  const openRenewModal = (doc) => {
    setCurrentDoc(doc);
    // Suggest default renew values: set expiry 1 year out and reminder 1 month before expiry
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const reminderDate = new Date(nextYear);
    reminderDate.setMonth(reminderDate.getMonth() - 1);
    
    setRenewForm({
      expiryDate: nextYear.toISOString().substring(0, 10),
      reminderStartDate: reminderDate.toISOString().substring(0, 10)
    });
    setShowRenewModal(true);
  };

  // Helper to open Edit modals
  const openEditPerson = (person) => {
    setCurrentPerson(person);
    setPersonForm({
      name: person.name,
      email: person.email,
      relationship: person.relationship
    });
    setShowPersonModal(true);
  };

  const openEditDoc = (doc) => {
    setCurrentDoc(doc);
    setDocForm({
      personId: doc.personId._id,
      docName: doc.docName,
      docNumber: doc.docNumber || '',
      expiryDate: new Date(doc.expiryDate).toISOString().substring(0, 10),
      reminderStartDate: new Date(doc.reminderStartDate).toISOString().substring(0, 10),
      sendToPerson: doc.sendToPerson,
      sendToUser: doc.sendToUser,
      customRecipients: doc.customRecipients || [],
      tempEmail: ''
    });
    setShowDocModal(true);
  };

  // Custom Tag Input handlers
  const handleAddEmailTag = () => {
    const email = docForm.tempEmail.trim().toLowerCase();
    if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      if (!docForm.customRecipients.includes(email)) {
        setDocForm({
          ...docForm,
          customRecipients: [...docForm.customRecipients, email],
          tempEmail: ''
        });
      } else {
        setDocForm({ ...docForm, tempEmail: '' });
      }
    } else if (email) {
      showToast('Please enter a valid email address', 'error');
    }
  };

  const handleRemoveEmailTag = (emailToRemove) => {
    setDocForm({
      ...docForm,
      customRecipients: docForm.customRecipients.filter((email) => email !== emailToRemove)
    });
  };

  // Stats Calculations
  const stats = {
    total: documents.length,
    active: documents.filter((d) => d.status === 'active').length,
    reminding: documents.filter((d) => d.status === 'reminding').length,
    expired: documents.filter((d) => d.status === 'expired').length,
    muted: documents.filter((d) => d.status === 'muted' || d.isMuted).length,
  };

  // Filter Documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesPerson = selectedPersonFilter === 'all' || doc.personId?._id === selectedPersonFilter;
    const matchesStatus = selectedStatusFilter === 'all' || doc.status === selectedStatusFilter;
    return matchesPerson && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div>{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <div className="brand">
          <div className="brand-icon">D</div>
          <span className="brand-name">DocExpire</span>
        </div>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">D</div>
          <span className="brand-name">DocExpire</span>
        </div>

        <nav className="nav-menu">
          <a
            href="#"
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          >
            <Icons.Dashboard />
            Dashboard
          </a>
          <a
            href="#"
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('documents'); setIsMobileMenuOpen(false); }}
          >
            <Icons.Documents />
            Documents Trackers
          </a>
          <a
            href="#"
            className={`nav-item ${activeTab === 'people' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('people'); setIsMobileMenuOpen(false); }}
          >
            <Icons.People />
            People Profiles
          </a>
        </nav>
      </aside>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main content body */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div>
            <div className="page-header">
              <div className="page-title">
                <h1>Overview</h1>
                <p>Welcome to Document Expiry and Reminders system</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={handleTriggerScan}>
                  🔄 Trigger Daily Scan
                </button>
                <button className="btn btn-primary" onClick={() => { resetDocForm(); setShowDocModal(true); }}>
                  <Icons.Plus /> Add Tracker
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="card stat-card">
                <div className="stat-icon blue">📁</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total Trackers</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="stat-icon green">🛡️</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.active}</span>
                  <span className="stat-label">Active Trackers</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="stat-icon amber">🔔</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.reminding}</span>
                  <span className="stat-label">Active Reminders</span>
                </div>
              </div>
              <div className="card stat-card">
                <div className="stat-icon red">🚨</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.expired}</span>
                  <span className="stat-label">Expired Documents</span>
                </div>
              </div>
            </div>

            {/* Expiring Soon section */}
            <div className="card" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Active Reminders & Expired Docs</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sorted by expiration</span>
              </div>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading trackers...</div>
              ) : documents.filter(d => d.status === 'reminding' || d.status === 'expired').length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">✅</div>
                  <h3>All Clear!</h3>
                  <p>There are no expired documents or active alerts right now.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Owner</th>
                        <th>Expiry Date</th>
                        <th>Reminder Started</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents
                        .filter(d => d.status === 'reminding' || d.status === 'expired')
                        .map((doc) => (
                          <tr key={doc._id}>
                            <td>
                              <div style={{ fontWeight: '600' }}>{doc.docName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.docNumber || 'No ID Number'}</div>
                            </td>
                            <td>{doc.personId?.name} ({doc.personId?.relationship})</td>
                            <td>
                              <div style={{ fontWeight: '500', color: doc.status === 'expired' ? 'var(--color-expired)' : 'inherit' }}>
                                {new Date(doc.expiryDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>{new Date(doc.reminderStartDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge badge-${doc.status}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-secondary btn-icon" title="Renew" onClick={() => openRenewModal(doc)}>
                                  <Icons.Renew />
                                </button>
                                <button className="btn btn-secondary btn-icon" title="Send Email Now" onClick={() => handleSendSingleEmail(doc._id, doc.docName)}>
                                  <Icons.Mail />
                                </button>
                                <button className="btn btn-secondary btn-icon" title={doc.isMuted ? 'Unmute Reminders' : 'Mute Reminders'} onClick={() => handleToggleMute(doc)}>
                                  {doc.isMuted ? <Icons.BellOff /> : <Icons.Bell />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="page-header">
              <div className="page-title">
                <h1>Document Trackers</h1>
                <p>Manage expiry and reminder dates for all documents</p>
              </div>
              <button className="btn btn-primary" onClick={() => { resetDocForm(); setShowDocModal(true); }}>
                <Icons.Plus /> Add Tracker
              </button>
            </div>

            {/* Filters bar */}
            <div className="card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Filter Person:</label>
                  <select
                    className="form-control"
                    style={{ padding: '6px 12px' }}
                    value={selectedPersonFilter}
                    onChange={(e) => setSelectedPersonFilter(e.target.value)}
                  >
                    <option value="all">All People</option>
                    {persons.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Filter Status:</label>
                  <select
                    className="form-control"
                    style={{ padding: '6px 12px' }}
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="reminding">Reminding</option>
                    <option value="expired">Expired</option>
                    <option value="muted">Muted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="card">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading documents...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📄</div>
                  <h3>No documents found</h3>
                  <p>Try changing your filters or add a new document tracker.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Owner</th>
                        <th>Expiry Date</th>
                        <th>Reminder Starts</th>
                        <th>Alert Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc._id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{doc.docName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.docNumber || 'No ID Number'}</div>
                          </td>
                          <td>{doc.personId?.name || 'Unknown'}</td>
                          <td>
                            <div style={{ fontWeight: '500', color: doc.status === 'expired' ? 'var(--color-expired)' : 'inherit' }}>
                              {new Date(doc.expiryDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td>{new Date(doc.reminderStartDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge badge-${doc.status}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-secondary btn-icon" title="Renew / Date Settings" onClick={() => openRenewModal(doc)}>
                                <Icons.Renew />
                              </button>
                              <button className="btn btn-secondary btn-icon" title="Edit Tracker" onClick={() => openEditDoc(doc)}>
                                <Icons.Edit />
                              </button>
                              <button className="btn btn-secondary btn-icon" title={doc.isMuted ? 'Unmute Reminders' : 'Mute Reminders'} onClick={() => handleToggleMute(doc)}>
                                {doc.isMuted ? <Icons.BellOff /> : <Icons.Bell />}
                              </button>
                              <button className="btn btn-secondary btn-icon" title="Send Email Remind Immediately" onClick={() => handleSendSingleEmail(doc._id, doc.docName)}>
                                <Icons.Mail />
                              </button>
                              <button className="btn btn-secondary btn-icon btn-danger" style={{ background: 'none', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-expired)' }} title="Delete Tracker" onClick={() => handleDeleteDoc(doc._id, doc.docName)}>
                                <Icons.Trash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div>
            <div className="page-header">
              <div className="page-title">
                <h1>People Profiles</h1>
                <p>Add and manage profiles of people (Self, Family Members, etc.)</p>
              </div>
              <button className="btn btn-primary" onClick={() => { setCurrentPerson(null); setPersonForm({ name: '', email: '', relationship: '' }); setShowPersonModal(true); }}>
                <Icons.Plus /> Add Person
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading people...</div>
            ) : persons.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state-icon">👥</div>
                <h3>No people added</h3>
                <p>Add profiles for family members or friends to start tracking their documents.</p>
                <button className="btn btn-primary" onClick={() => setShowPersonModal(true)}>
                  Add First Person
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {persons.map((person) => {
                  const personDocs = documents.filter((d) => d.personId?._id === person._id);
                  const expiredCount = personDocs.filter((d) => d.status === 'expired').length;
                  const remindingCount = personDocs.filter((d) => d.status === 'reminding').length;
                  
                  return (
                    <div key={person._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{person.name}</h3>
                            <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)', display: 'inline-block', marginTop: '4px' }}>
                              {person.relationship}
                            </span>
                          </div>
                          <div style={{ fontSize: '24px' }}>👤</div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                          <Icons.Mail />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{person.email}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Trackers: <strong>{personDocs.length}</strong></span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {expiredCount > 0 && <span className="badge badge-expired" style={{ padding: '2px 6px', fontSize: '10px' }}>{expiredCount} Expired</span>}
                            {remindingCount > 0 && <span className="badge badge-reminding" style={{ padding: '2px 6px', fontSize: '10px' }}>{remindingCount} Alerts</span>}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button className="btn btn-secondary btn-icon" onClick={() => openEditPerson(person)}>
                            <Icons.Edit />
                          </button>
                          <button className="btn btn-secondary btn-icon btn-danger" style={{ background: 'none', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-expired)' }} onClick={() => handleDeletePerson(person._id, person.name)}>
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: Person Add/Edit */}
      {showPersonModal && (
        <div className="modal-backdrop" onClick={() => setShowPersonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{currentPerson ? 'Edit Person Profile' : 'Add Person Profile'}</h2>
              <button className="modal-close" onClick={() => setShowPersonModal(false)}>×</button>
            </div>
            <form onSubmit={handlePersonSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., John Doe"
                    value={personForm.name}
                    onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address (For Reminders)</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="e.g., johndoe@gmail.com"
                    value={personForm.email}
                    onChange={(e) => setPersonForm({ ...personForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Brother, Father, Self"
                    value={personForm.relationship}
                    onChange={(e) => setPersonForm({ ...personForm, relationship: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPersonModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Document Add/Edit */}
      {showDocModal && (
        <div className="modal-backdrop" onClick={() => setShowDocModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{currentDoc ? 'Edit Document Tracker' : 'Add Document Tracker'}</h2>
              <button className="modal-close" onClick={() => setShowDocModal(false)}>×</button>
            </div>
            <form onSubmit={handleDocSubmit}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Associated Person *</label>
                  <select
                    required
                    className="form-control"
                    value={docForm.personId}
                    onChange={(e) => setDocForm({ ...docForm, personId: e.target.value })}
                    disabled={!!currentDoc}
                  >
                    <option value="">-- Select Profile --</option>
                    {persons.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.relationship})</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Document Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g., Driving License"
                      value={docForm.docName}
                      onChange={(e) => setDocForm({ ...docForm, docName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Document/ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., DL-9281928"
                      value={docForm.docNumber}
                      onChange={(e) => setDocForm({ ...docForm, docNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={docForm.expiryDate}
                      onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remind Starts On *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={docForm.reminderStartDate}
                      onChange={(e) => setDocForm({ ...docForm, reminderStartDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Email Notification Routing</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={docForm.sendToPerson}
                        onChange={(e) => setDocForm({ ...docForm, sendToPerson: e.target.checked })}
                      />
                      <span className="form-label" style={{ marginBottom: 0 }}>Send reminders to owner's email address</span>
                    </label>

                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={docForm.sendToUser}
                        onChange={(e) => setDocForm({ ...docForm, sendToUser: e.target.checked })}
                      />
                      <span className="form-label" style={{ marginBottom: 0 }}>Send reminders to system administrator email</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Custom / Group Emails</label>
                    <div className="tags-input-container">
                      {docForm.customRecipients.map((email, i) => (
                        <span key={i} className="tag-chip">
                          {email}
                          <button type="button" className="tag-remove" onClick={() => handleRemoveEmailTag(email)}>×</button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="tag-input"
                        placeholder="Add multiple emails (press Enter)"
                        value={docForm.tempEmail}
                        onChange={(e) => setDocForm({ ...docForm, tempEmail: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddEmailTag();
                          }
                        }}
                        onBlur={handleAddEmailTag}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDocModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Tracker</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Renew Document (Stop reminder / Extend expiry) */}
      {showRenewModal && (
        <div className="modal-backdrop" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Renew Document: {currentDoc?.docName}</h2>
              <button className="modal-close" onClick={() => setShowRenewModal(false)}>×</button>
            </div>
            <form onSubmit={handleRenewSubmit}>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                  Renewing this document will extend its expiry date, automatically unmute notifications, and clear any warnings.
                </p>
                <div className="form-group">
                  <label className="form-label">New Expiry Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={renewForm.expiryDate}
                    onChange={(e) => setRenewForm({ ...renewForm, expiryDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Reminder Start Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={renewForm.reminderStartDate}
                    onChange={(e) => setRenewForm({ ...renewForm, reminderStartDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-danger"
                  style={{ background: 'none', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-expired)' }}
                  onClick={() => {
                    handleToggleMute(currentDoc);
                    setShowRenewModal(false);
                  }}
                >
                  {currentDoc?.isMuted ? 'Unmute Reminders' : 'Mute Reminders Only'}
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRenewModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Renew & Unmute</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

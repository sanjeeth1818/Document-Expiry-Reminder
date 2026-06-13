const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Persons API
  getPersons: async () => {
    const res = await fetch(`${API_URL}/persons`);
    return handleResponse(res);
  },

  createPerson: async (personData) => {
    const res = await fetch(`${API_URL}/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personData),
    });
    return handleResponse(res);
  },

  updatePerson: async (id, personData) => {
    const res = await fetch(`${API_URL}/persons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personData),
    });
    return handleResponse(res);
  },

  deletePerson: async (id) => {
    const res = await fetch(`${API_URL}/persons/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Documents API
  getDocuments: async (personId = '') => {
    const query = personId ? `?personId=${personId}` : '';
    const res = await fetch(`${API_URL}/documents${query}`);
    return handleResponse(res);
  },

  createDocument: async (docData) => {
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    return handleResponse(res);
  },

  updateDocument: async (id, docData) => {
    const res = await fetch(`${API_URL}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    return handleResponse(res);
  },

  deleteDocument: async (id) => {
    const res = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  muteDocument: async (id, isMuted) => {
    const res = await fetch(`${API_URL}/documents/${id}/mute`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isMuted }),
    });
    return handleResponse(res);
  },

  renewDocument: async (id, dates) => {
    const res = await fetch(`${API_URL}/documents/${id}/renew`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dates),
    });
    return handleResponse(res);
  },

  triggerReminders: async () => {
    const res = await fetch(`${API_URL}/documents/trigger-reminders`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  sendManualEmail: async (id) => {
    const res = await fetch(`${API_URL}/documents/${id}/send-manual-email`, {
      method: 'POST',
    });
    return handleResponse(res);
  },
};

// Smart Base URL detection: Automatically ensures /api or correct endpoint
function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
}

const BASE_URL = getApiBaseUrl();

export function getAuthToken() {
  return localStorage.getItem('ldrp_auth_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('ldrp_auth_token', token);
  } else {
    localStorage.removeItem('ldrp_auth_token');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getDemoAccounts: () => apiRequest('/auth/demo-accounts'),
  getMe: () => apiRequest('/auth/me'),
  changePassword: (data) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // Students
  getStudents: (params = '') => apiRequest(`/students${params ? `?${params}` : ''}`),
  getGroups: () => apiRequest('/students/groups'),
  getStudentById: (id) => apiRequest(`/students/${id}`),

  // Forms
  getForms: () => apiRequest('/forms'),
  getFormById: (id) => apiRequest(`/forms/${id}`),
  createForm: (formData) => apiRequest('/forms', { method: 'POST', body: JSON.stringify(formData) }),
  submitForm: (formId, body, isFormData = false) => apiRequest(`/forms/${formId}/submit`, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body)
  }),
  getNudgeList: (formId) => apiRequest(`/forms/${formId}/nudge-list`),
  updateSubmissionStatus: (subId, data) => apiRequest(`/forms/submission/${subId}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Holidays
  getActiveHolidayPoll: () => apiRequest('/holidays/active-poll'),
  voteHoliday: (data) => apiRequest('/holidays/vote', { method: 'POST', body: JSON.stringify(data) }),

  // Announcements
  getAnnouncements: () => apiRequest('/announcements'),
  createAnnouncement: (data) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, { method: 'DELETE' }),

  // Leaves
  getLeaves: () => apiRequest('/leaves'),
  applyLeave: (data) => apiRequest('/leaves/apply', { method: 'POST', body: JSON.stringify(data) }),
  updateLeaveStatus: (id, data) => apiRequest(`/leaves/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Academics
  getSubjects: () => apiRequest('/academics/subjects'),
  getTimetable: () => apiRequest('/academics/timetable'),

  // Analytics
  getAnalyticsOverview: () => apiRequest('/analytics/overview'),
  exportFormData: (formId) => apiRequest(`/analytics/export/${formId}`)
};
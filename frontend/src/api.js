const API = 'http://localhost:5000/api';

export function getToken() { return localStorage.getItem('fp_token'); }
export function setToken(t) { localStorage.setItem('fp_token', t); }
export function clearToken() { localStorage.removeItem('fp_token'); }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getWorkouts: () => request('/workouts'),
  addWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),
  getStats: () => request('/workouts/stats'),

    setGoal: (weekly) => request('/workouts/goal', { method: 'PUT', body: JSON.stringify({ weekly }) }),

};

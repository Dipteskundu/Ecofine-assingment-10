import { auth } from '../Firebase/firebase.config'

export const API_BASE = import.meta.env?.VITE_API_BASE || 'https://server-bzhwshzg7-diptes-projects.vercel.app'

const buildUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

export const authFetch = async (endpoint, options = {}, requireAuth = false) => {
  const headers = { Accept: 'application/json', ...(options.headers || {}) }
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'

  if (requireAuth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  const url = buildUrl(endpoint)
  return fetch(url, { ...options, headers })
}
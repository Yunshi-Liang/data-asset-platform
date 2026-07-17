import { currentUser } from '../mock/currentUser'

export const AUTH_SESSION_KEY = 'data-asset-demo-auth'

// Front-end-only credentials for the interview demo. Production authentication
// must be implemented by a backend with password hashing, tokens and authorization.
const DEMO_PASSWORD = '123456'

export function authenticate(username, password) {
  return username === currentUser.account && password === DEMO_PASSWORD
}

export function setAuthenticated() {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ authenticated: true, userId: 'mock-user-zhang' }))
}

export function clearAuthentication() {
  sessionStorage.removeItem(AUTH_SESSION_KEY)
}

export function isAuthenticated() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY))?.authenticated === true
  } catch {
    return false
  }
}

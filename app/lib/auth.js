// lib/auth.js - ADD redirect to logout
const TOKEN_KEY = 'adminToken';

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/'; // ADD: Redirect to home after logout
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch('http://localhost:3001/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const isAdmin = async () => {
  return await isAuthenticated();
};
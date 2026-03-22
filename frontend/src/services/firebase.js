// Auth service — handles customer and admin authentication and JWT management
import api from './api';

const TOKEN_KEY = 'mz_auth_token';
const USER_KEY = 'mz_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => {
    try {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearUser = () => localStorage.removeItem(USER_KEY);

// Customer authentication
export const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.token) {
        setToken(data.token);
        setUser(data.user);
    }
    return data; // { token, user, message }
};

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
        setToken(data.token);
        setUser(data.user);
    }
    return data; // { token, user, message }
};

// Admin authentication
export const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin-login', { email, password });
    if (data.token) {
        setToken(data.token);
        setUser(data.user);
    }
    return data; // { token, user, message }
};

// Logout
export const logout = () => {
    clearToken();
    clearUser();
};

// Get current user profile
export const fetchMe = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data);
    return data;
};

import axios from 'axios';
import { getToken } from './firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
});

// Attach JWT from localStorage to each request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.message || err.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// ============ API Service Functions ============

// --- Auth ---
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    adminLogin: (data) => api.post('/auth/admin-login', data),
    getMe: () => api.get('/auth/me'),
};

// --- Products / Mangoes ---
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}`),
    create: (formData) => api.post('/products', formData),
    update: (id, formData) => api.put(`/products/${id}`, formData),
    delete: (id) => api.delete(`/products/${id}`),
    deleteImage: (id, imageUrl) => api.delete(`/products/${id}/image`, { data: { imageUrl } }),
};

// --- Cart ---
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart/add', data),
    update: (data) => api.put('/cart/update', data),
    remove: (data) => api.delete('/cart/remove', { data }),
    clear: () => api.delete('/cart/clear'),
};

// --- Orders ---
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my'),
    getAll: (params) => api.get('/orders', { params }),
    track: (orderId) => api.get(`/orders/track/${orderId}`),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
    cancelOrder: (orderId) => api.put(`/orders/cancel/${orderId}`),
};

// --- Blogs ---
export const blogAPI = {
    getAll: (params) => api.get('/blogs', { params }),
    getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
    getById: (id) => api.get(`/blogs/${id}`),
    create: (formData) => api.post('/blogs', formData),
    update: (id, formData) => api.put(`/blogs/${id}`, formData),
    delete: (id) => api.delete(`/blogs/${id}`),
};

// --- Bulk Orders ---
export const bulkOrderAPI = {
    create: (data) => api.post('/bulkorders', data),
    getAll: (params) => api.get('/bulkorders', { params }),
    getById: (id) => api.get(`/bulkorders/${id}`),
    update: (id, data) => api.put(`/bulkorders/${id}`, data),
    delete: (id) => api.delete(`/bulkorders/${id}`),
};

// --- Reviews ---
export const reviewAPI = {
    getByMango: (mangoId, params) => api.get(`/reviews/${mangoId}`, { params }),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
};

// --- Coupons ---
export const couponAPI = {
    getAll: (params) => api.get('/coupons', { params }),
    validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
    create: (data) => api.post('/coupons', data),
    update: (id, data) => api.put(`/coupons/${id}`, data),
    delete: (id) => api.delete(`/coupons/${id}`),
};

// --- Subscriptions ---
export const subscriptionAPI = {
    getAll: (params) => api.get('/subscriptions', { params }),
    create: (data) => api.post('/subscriptions', data),
    update: (id, data) => api.put(`/subscriptions/${id}`, data),
    cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
    delete: (id) => api.delete(`/subscriptions/${id}`),
};

// --- Users ---
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getAll: (params) => api.get('/users', { params }),
};

// --- Sponsors ---
export const sponsorAPI = {
    validate: (code) => api.post('/sponsors/validate', { code }),
    getAll: (params) => api.get('/sponsors', { params }),
    getById: (id) => api.get(`/sponsors/${id}`),
    getStats: (id) => api.get(`/sponsors/${id}/stats`),
    create: (data) => api.post('/sponsors', data),
    update: (id, data) => api.put(`/sponsors/${id}`, data),
    delete: (id) => api.delete(`/sponsors/${id}`),
};

// --- Offers ---
export const offerAPI = {
    getActive: () => api.get('/offers/active'),
    getAll: (params) => api.get('/offers', { params }),
    getBySlug: (slug) => api.get(`/offers/slug/${slug}`),
    getById: (id) => api.get(`/offers/${id}`),
    create: (formData) => api.post('/offers', formData),
    update: (id, formData) => api.put(`/offers/${id}`, formData),
    delete: (id) => api.delete(`/offers/${id}`),
};

// --- Settings ---
export const settingsAPI = {
    get: () => api.get('/settings'),
    getFull: () => api.get('/settings/full'),
    update: (formData) => api.put('/settings', formData),
    reset: () => api.post('/settings/reset'),
};

// --- Admin ---
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getBanners: () => api.get('/admin/banners'),
    getAllBanners: () => api.get('/admin/banners/all'),
    createBanner: (formData) => api.post('/admin/banners', formData),
    updateBanner: (id, formData) => api.put(`/admin/banners/${id}`, formData),
    deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
};

export default api;

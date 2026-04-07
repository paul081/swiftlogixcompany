import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        if (error.response?.status === 429) {
            alert('Too many requests. Please slow down and try again later.');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const shipmentService = {
    track: async (trackingNumber: string) => {
        const response = await api.get(`/shipments/track/${trackingNumber}`);
        return response.data;
    },
    getAllShipments: async () => {
        const response = await api.get('/shipments');
        return response.data;
    },
    createShipment: async (shipmentData: any) => {
        const response = await api.post('/shipments', shipmentData);
        return response.data;
    },
    updateStatus: async (id: string, statusData: any) => {
        const response = await api.put(`/shipments/${id}/status`, statusData);
        return response.data;
    },
    updateFinancials: async (id: string, financialData: any) => {
        const response = await api.put(`/shipments/${id}/financials`, financialData);
        return response.data;
    },
    deleteShipment: async (id: string) => {
        const response = await api.delete(`/shipments/${id}`);
        return response.data;
    },
    getMyShipments: async () => {
        const response = await api.get('/shipments/my-shipments');
        return response.data;
    }
};

export const adminService = {
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    updateUser: async (id: string, userData: any) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }
};

export const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },
    markAsRead: async (id: string) => {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    }
};

export default api;

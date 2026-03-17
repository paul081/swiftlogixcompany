'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // Only keep Admin sessions
            if (userData.role === 'admin') {
                setUser(userData);
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        const userData = await authService.login(credentials);
        if (userData.role === 'admin') {
            setUser(userData);
            return userData;
        } else {
            authService.logout();
            throw new Error('Not authorized as an admin');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

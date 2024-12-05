import React, { createContext, useState, useEffect } from 'react';
import api from './BaseService';

export interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async (a: string, b: string) => {a+b},
    logout: () => {},
    refreshAccessToken: async () => {}
});

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await api.post('/token/refresh/', {
            refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
    } catch (error) {
        console.error('Failed to refresh token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token); // Check if the access token exists
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/token/', {
                email,
                password,
            });
            console.log(response);
            
            const { access, refresh } = response.data; // Adjust according to your response structure
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Optionally, you could handle errors here
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
    
        try {
            const response = await api.post('/token/refresh/', {
                refresh: refreshToken,
            });
            
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
import axios from 'axios';
import { refreshAccessToken } from './AuthContext';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log("calling ", token);
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json'
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error response indicates an expired access token
        console.log(error);
        
        if (error.response && error.response.status === 401) {
            try {
                // Attempt to refresh the token
                console.log("Refreshing token");
                
                await refreshAccessToken(); // This should handle refreshing the token
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError); // Reject the promise with the original error
            }
        }

        return Promise.reject(error); // Reject the promise with the original error
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response; // Return the response if it's successful
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error response indicates an expired access token
        console.log(error);
        
        if (error.response && error.response.status === 401) {
            try {
                // Attempt to refresh the token
                console.log("Refreshing token");
                
                await refreshAccessToken(); // This should handle refreshing the token
                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError); // Reject the promise with the original error
            }
        }

        return Promise.reject(error); // Reject the promise with the original error
    }
);

export default api;
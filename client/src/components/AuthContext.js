import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context for auth state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, role: '' });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/check-auth', { withCredentials: true });
                if (response.data.Status === 'Authenticated') {
                    setAuth({ isAuthenticated: true, role: response.data.Role });
                } else {
                    setAuth({ isAuthenticated: false, role: '' });
                }
            } catch (error) {
                setAuth({ isAuthenticated: false, role: '' });
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

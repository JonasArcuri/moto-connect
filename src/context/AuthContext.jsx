import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        setUser(AuthService.getCurrentUser());
    }, []);

    const login = async (email, password) => {
        const result = await AuthService.login(email, password);
        if (result.success) {
            setUser(result.data);
        }
        return result; // ✅ agora o LoginForm recebe {success, data, message}
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

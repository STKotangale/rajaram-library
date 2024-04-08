import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const storedAuthState = JSON.parse(localStorage.getItem('authState'));
        return storedAuthState || { username: null, accessToken: null };
    });

    useEffect(() => {
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    const login = (username, accessToken) => {
        setAuthState({ username, accessToken });
    };

    const logout = () => {
        setAuthState({ username: null, accessToken: null });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

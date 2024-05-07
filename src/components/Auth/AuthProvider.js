import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const storedAuthState = JSON.parse(sessionStorage.getItem('authState'));
        return storedAuthState || { username: null, accessToken: null };
    });

    useEffect(() => {
        sessionStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);


    // const [authState, setAuthState] = useState({ username: null, accessToken: null });

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



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const navigate = useNavigate(); // Initialize useNavigate hook

//     const [authState, setAuthState] = useState(() => {
//         const storedAuthState = JSON.parse(sessionStorage.getItem('authState'));
//         return storedAuthState || { username: null, accessToken: null };
//     });

//     useEffect(() => {
//         sessionStorage.setItem('authState', JSON.stringify(authState));
//     }, [authState]);

//     const login = (username, accessToken) => {
//         setAuthState({ username, accessToken });
//     };

//     const logout = () => {
//         setAuthState({ username: null, accessToken: null });
//         // Clear navigation history and navigate to login page
//         navigate('/');
//         // window.history.pushState({}, '', '/');

//     };

//     return (
//         <AuthContext.Provider value={{ ...authState, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

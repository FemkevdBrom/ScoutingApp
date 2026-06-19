import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserFromToken = async (token) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUser({ ...data, token });
        } catch {
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            fetchUserFromToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        await fetchUserFromToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
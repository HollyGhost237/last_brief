// src/contexts/AuthContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Vérifie l'authentification au chargement
    useEffect(() => {
        const verifyAuth = async () => {
        const auth_token = localStorage.getItem('auth_token');
        console.log('auth_token verification', auth_token);
        if (!auth_token) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.get('http://localhost:8000/api/user', {
            headers: { Authorization: `Bearer ${auth_token}` }
            });
            console.log('Verification reponse', res.data);
            setUser(res.data);
        } catch (error) {
            localStorage.removeItem('auth_token');
            console.log(error)
        } finally {
            setIsLoading(false);
        }
        };

        verifyAuth();
    }, []);

    const login = async (credentials) => {
        const res = await axios.post('http://localhost:8000/api/login', credentials);
        localStorage.setItem('auth_token', res.data.token);
        console.log('Verification reponse token', res.data);
        setUser(res.data.user);
        navigate('/dashboard');
    };

    const logout = async () => {
        await axios.post('http://localhost:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};
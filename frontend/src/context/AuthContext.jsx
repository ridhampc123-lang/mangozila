import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, clearToken, fetchMe } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // MongoDB user object
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = getToken();
        if (!token) { setUser(null); setLoading(false); return; }
        try {
            const data = await fetchMe();
            setUser(data);
        } catch {
            clearToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const logout = () => {
        clearToken();
        setUser(null);
    };

    const refreshProfile = async () => {
        try {
            const data = await fetchMe();
            setUser(data);
        } catch { /* ignore */ }
    };

    return (
        <AuthContext.Provider value={{ user, dbUser: user, loading, logout, refreshProfile, reloadUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

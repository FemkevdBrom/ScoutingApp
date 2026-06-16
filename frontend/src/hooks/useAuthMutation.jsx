import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthMutation = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = async (url, options = {}) => {
        if (!user?.token) {
            throw new Error("Geen token beschikbaar");
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const message = await response.text().catch(() => 'Onbekende fout');
                throw new Error(message || `HTTP error! status: ${response.status}`);
            }

            // Probeer JSON te parsen, maar niet alle responses hebben body
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return await response.text();
        } catch (err) {
            console.error("useAuthMutation error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
};
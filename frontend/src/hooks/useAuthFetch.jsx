import {useState, useEffect, useContext} from 'react';
import {AuthContext} from "../context/AuthContext";

export const useAuthFetch = (url, options = {}) => {
    const {user} = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.token) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const respone  = await fetch(url, {
                    ...options,
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                });

                if (response.ok) {
                    throw new Error('HTTP error! status: ${response.status}');
                }

                const result = await respone.json();
                setData(result);
            } catch (err) {
                console.error("useAuthFetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    },[url, user?.token]);
    return {data, error, loading};
};
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!url) return;
        setLoading(true);
        fetch(url,
            {
                method: options.method || 'GET',
                headers: {
                    'Content-Type':'application/json',
                    ...options.headers,
                },
                body: options.body ? JSON.stringify(options.body) : null,
            }
        )
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(body => {
                        throw {
                            status: res.status,
                            message: body?.message || res.statusText,
                        };
                    });
                }
                return res.json();
            })
            .then((data) => setData(data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [url, JSON.stringify(options)])

    return { data, loading, error }
}


export default useFetch;
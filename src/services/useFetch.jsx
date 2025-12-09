import { useState, useEffect } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState('loading');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
                return res.json();
            })
            .then((data) => setData(data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [url])

    return { data, loading, error }
}


export default useFetch;
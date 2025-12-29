import { useState, useEffect } from "react";
import Header from "../components/Header";
import useFetch from "../services/useFetch";

function Login () {
    const url = import.meta.env.VITE_API_URL;
    const [shouldConnect, setShouldConnect] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { data, loading, error } = useFetch(
        shouldConnect ? `${url}/api/login` : null,
        shouldConnect
        ? {
            method: 'POST',
            body: {
                email: form.email,
                password: form.password,
                pseudo: form.pseudo,
            }
        }
        : null
    );

    useEffect(() => {
        if (error || data) {
            setShouldConnect(false);
        }
        if (error) {
            setLocalError(error);
        }
        const token = data?.token ?? null;
        if (token) {
            setLocalError(null);
            localStorage.setItem('token', token);
        }
    }, [error, data]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(data => ({
            ...data,
            [name]: value
        }));
    }

    function sendConnection() {
        setShouldConnect(true);
    }
    return (
        <>
            <Header />
             <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Register</h1>
                <form onSubmit={(e) => { e.preventDefault(); sendConnection(); }} className="flex justify-center">
                    <section className="flex h-full flex-col justify-center items-center bg-gray-50 border border-gray-800 rounded w-66 gap-3 p-3">
                        <label htmlFor="email">Email</label>
                        <input required value={form.email} onChange={handleChange} className="p-2 border rounded" id="email" name="email" placeholder="johndoe@gmail.com" type="text" />
                        <label htmlFor="password">Mot de passe</label>
                        <input required value={form.password} onChange={handleChange} className="p-2 border rounded" id="password" name="password" type="password" placeholder="JohnDoe"/>
                        <button className="border rounded p-1 bg-green-400 text-gray-50 cursor-pointer" onClick={sendConnection}>Se connecter</button>
                        {loading && (
                            <span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>
                        )}
                        { data && (
                            <>
                                <span className="text-green-400">Vous êtes connecté !</span>
                            </>
                        )}
                        {localError && (
                            <span className="text-red-400">Erreur {localError.status} : {localError.message}</span>
                        )}
                    </section>
                </form>
            </main>
        </>
    );
}

export default Login;
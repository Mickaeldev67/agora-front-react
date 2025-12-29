import { Link } from "react-router";
import Header from "../components/Header";
import useFetch from "../services/useFetch";
import { useState, useEffect } from "react";

function Register () {
    const url = import.meta.env.VITE_API_URL;
    const [form, setForm] = useState({
        email: '',
        password: '',
        pseudo: ''
    });
    const [shouldRegister, setShouldRegister] = useState(false);
    const [localError, setLocalError] = useState(null);

    const { data, loading, error } = useFetch(
        shouldRegister ? `${url}/api/register` : null,
        shouldRegister
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
            setShouldRegister(false);
        }
        if (error) {
            setLocalError(error);
        }
        const pseudo = data?.user?.pseudo ?? null;
        if (pseudo) {
            setLocalError(null);
        }
    }, [error, data]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(data => ({
            ...data,
            [name]: value
        }));
    }

    function sendRegister() {
        setShouldRegister(true);
    }
    return (
        <>
            <Header />
            <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Register</h1>
                <form onSubmit={(e) => { e.preventDefault(); sendRegister(); }} className="flex justify-center">
                    <section className="flex h-full flex-col justify-center items-center bg-gray-50 border border-gray-800 rounded w-66 gap-3 p-3">
                        <label htmlFor="email">Email</label>
                        <input required value={form.email} onChange={handleChange} className="p-2 border rounded" id="email" name="email" placeholder="johndoe@gmail.com" type="text" />
                        <label htmlFor="password">Mot de passe</label>
                        <input required value={form.password} onChange={handleChange} className="p-2 border rounded" id="password" name="password" type="password" placeholder="JohnDoe"/>
                        <label htmlFor="pseudo">Pseudo</label>
                        <input required value={form.pseudo} onChange={handleChange} className="p-2 border rounded" id="pseudo" name="pseudo" placeholder="johndoe123" type="text" />
                        <button className="border rounded p-1 bg-green-400 text-gray-50 cursor-pointer" onClick={sendRegister}>S'inscrire</button>
                        {loading && (
                            <span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>
                        )}
                        {localError && (
                            <span className="text-red-400">Erreur {localError.status} : {localError.message}</span>
                        )}
                        {data && (
                            <span className="text-green-400">Utilisateur <strong>{data.user?.pseudo}</strong> a bien été créé, vous pouvez vous <Link className="hover:text-green-300" to={'/login'}>connecter</Link></span>
                        )}
                    </section>
                </form>
            </main>
        </>
    );
}

export default Register;
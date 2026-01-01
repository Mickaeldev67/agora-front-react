import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUserCommunities } from "../context/userCommunitiesContext";
import useFetch from "../services/useFetch";

function NewThread() {
    const location = useLocation();
    const navigate = useNavigate();
    const community = location.state?.community;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);

    useEffect(() => {
        if (!community) {
            navigate("/", { replace: true });
        }
    }, [community, navigate]);


    if (!community) {
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!title || !content) return;

        const body = {
            title,
            content,
            community_id: Number(community.id),
        };
        setLoading(true);

        fetch(`${url}/api/thread/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(res => res.json())
            .then(data => {
                if (data.thread?.id) {
                    navigate(`/thread/${data.thread.id}`, { replace: true });
                }
            })
            .catch(err => console.error(err))
            .finally(setLoading(false));
    }

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function handleContent(e) {
        setContent(e.target.value);
    }

    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">
                Création d'un thread dans {community.name}
            </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titre</label>
                <input
                    className="p-2 w-full border rounded"
                    type="text"
                    id="title"
                    placeholder="Comment faire... ?"
                    value={title}
                    onChange={handleTitle}
                />
                <label htmlFor="content">Contenu</label>
                <textarea
                    className="p-2 w-full border rounded"
                    type="text"
                    id="content"
                    placeholder="Description..."
                    value={content}
                    onChange={handleContent}
                />
                <div className="flex gap-4 items-center justify-center">
                    <button type="submit" className="border px-3 py-1 rounded border-green-500 bg-green-300 text-gray-50">Créer</button>
                    {loading && (
                        <span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>
                    )}
                </div>
            </form>
        </section>
    );
}

export default NewThread;
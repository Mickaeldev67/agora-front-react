import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUserCommunities } from "../context/userCommunitiesContext";
import useFetch from "../services/useFetch";

function EditThread() {
    const location = useLocation();
    const navigate = useNavigate();
    const thread = location.state?.thread;
    const [title, setTitle] = useState(thread?.title);
    const [content, setContent] = useState(thread?.content);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);

    useEffect(() => {
        if (!thread) {
            navigate("/", { replace: true });
        }
    }, [thread, navigate]);

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function handleContent(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!title || !content || !token) return;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: thread?.id,
                title,
                content,
            }),
        };

        setLoading(true);
        fetch(`${url}/api/thread/update`, options)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Erreur inconnue");
                }
                return data;
            })
            .then(data => {
                if (data.thread?.id) {
                    navigate(`/thread/${data.thread.id}`, { replace: true });
                }
            })
            .catch(err => setLocalError(err.message))
            .finally(() => setLoading(false));
    }
    return(
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">
                Modification du Thread
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
                    <button disabled={loading} type="submit" className="border px-3 py-1 rounded border-green-500 bg-green-300 text-gray-50">Modifier</button>
                    {loading && (
                        <span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>
                    )}
                </div>
            </form>
            { localError && (
                <span className="text-red-400">{localError}</span>
            )}
        </section>
    );
}

export default EditThread;
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUserCommunities } from "../context/UserCommunitiesContext";

function EditPost() {
    const location = useLocation();
    const navigate = useNavigate();
    const post = location.state?.post;
    const threadId = location.state?.threadId;
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(post.content);
     const { token, isTokenExpired, logout } = useUserCommunities();
     const url = import.meta.env.VITE_API_URL;
        useEffect(() => {
            if (token && isTokenExpired(token)) {
                logout();
            }
        }, [token, logout, isTokenExpired]);

    function handleSubmit(e) {
        e.preventDefault();
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: post.id,
                content,
            }),
        };

        setLoading(true);
        fetch(`${url}/api/post/update`, options)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Erreur inconnue");
                }
                return data;
            })
            .then(() => {
                navigate(`/thread/${threadId}`, { replace: true });
            })
            .catch(err => setLocalError(err.message))
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea className="px-2 py-1 border rounded w-full" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Ecriver votre message."></textarea>
            <button type="submit" className="border px-3 py-1 rounded border-blue-500 bg-blue-300 text-gray-50 cursor-pointer">Modifier</button>
        </form>
    )
}

export default EditPost;
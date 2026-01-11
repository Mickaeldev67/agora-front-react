import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../services/useFetch";
import Skeleton from "../components/SkeletonComponent";
import Reaction from "../components/Reaction";
import ThreadComponent from "../components/ThreadComponent";
import { useUserCommunities } from "../context/userCommunitiesContext";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

function Thread() {
    const params = useParams();
    const url = import.meta.env.VITE_API_URL;
    const { token, user, isTokenExpired, logout } = useUserCommunities();
    const [content, setContent] = useState();
    const menuRefs = useRef({});
    const [loadingPost, setLoadingPost] = useState(false);
    const [openPostId, setOpenPostId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [errorPost, setErrorPost] = useState("");
    const [errorDeletePost, setErrorDeletePost] = useState('');
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/thread/${params?.id}/posts`, options);
    const navigate = useNavigate();
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);

    useEffect(() => {
        if (data?.posts) {
            setPosts(data.posts);
        }
    }, [data]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!openPostId) return;

            const menuEl = menuRefs.current[openPostId];
            if (menuEl && !menuEl.contains(e.target)) {
                setOpenPostId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!params?.id) return;

        const hubUrl = import.meta.env.VITE_MERCURE_URL;
        const url = new URL(hubUrl);
        url.searchParams.append("topic", `thread-${params.id}`);

        const eventSource = new EventSource(url, { withCredentials: true });

        eventSource.onmessage = (event) => {
            const newPost = JSON.parse(event.data);

            setPosts(prev => {
                // évite les doublons
                if (prev.some(p => p.id === newPost.id)) return prev;
                return [...prev, newPost];
            });
        };

        return () => eventSource.close();
    }, [params?.id]);

    function handleRefresh() {
        navigate("/", { replace: true });
    }

    function deletePost(postId) {
        setErrorDeletePost('');
        if (!token) return;

        fetch(`${url}/api/post/delete/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Impossible de supprimer le post");
                // Retirer le post supprimé du state
                setPosts(prev => prev.filter(post => post.id !== postId));
                // Si le menu était ouvert sur ce post, on le ferme
                if (openPostId === postId) setOpenPostId(null);
            })
            .catch(err => setErrorDeletePost(err));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setErrorPost("");
        if (!content && !token) return;
        const body = {
            content,
            thread_id: params?.id
        };
        setLoadingPost(true);
        fetch(`${url}/api/post/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(res => res.json())
            .then(() => {
                setContent("");
            })
            .catch(err => console.error(err))
            .finally(setLoadingPost(false));
    }
    return (
        <section>
            <h1 className="text-primary-400 text-2xl">Thread</h1>

            {loading && (
                <Skeleton />
            )}

            {error && (
                <p>Erreur {error.status} : {error.message}</p>
            )}
            {data && (
                <ThreadComponent thread={data.thread} id={data.thread.id} onThreadDeleted={handleRefresh} />
            )}
            {posts && (
                <>
                    <h2 className="text-primary-400 text-xl">Comments</h2>
                    {
                        posts.length === 0 ? <p>Il n'y a pas de post sur ce thread, pourquoi ne pas vous lancer ?</p>
                            : posts.map(post => {
                                const isOwner = post.user?.id === user?.id;
                                const isAdmin = user?.isAdmin;
                                return (
                                    <article className="border rounded p-4 mb-4 bg-gray-50" key={post.id}>
                                        <div className="flex justify-between">
                                            <div className="text-xs">
                                                <span className="font-bold">{post.pseudo}</span> <span>{new Date(post.updatedAt ?? post.createdAt).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {(isOwner || isAdmin) && (
                                                <div className="relative text-base">
                                                    <FontAwesomeIcon className="hover:text-gray-300 cursor-pointer" icon={faEllipsisVertical} onClick={() => {
                                                        setOpenPostId(openPostId === post.id ? null : post.id);
                                                    }} />
                                                    {openPostId === post.id && (
                                                        <div
                                                            ref={(el) => menuRefs.current[post.id] = el}
                                                            className="absolute flex flex-col right-0 bg-gray-50 border rounded py-1 px-2"
                                                            onClick={(e) => e.stopPropagation()}>
                                                            {isOwner && (<Link className="hover:text-gray-300" to={'/editPost'} state={{ threadId: params.id, post }}><span>Modifier</span></Link>)}
                                                            {(isOwner || isAdmin)
                                                                && (
                                                                    <span
                                                                        className="hover:text-gray-300 cursor-pointer"
                                                                        onClick={() => deletePost(post.id)}>Supprimer</span>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        </div>

                                        <p>{post.content}</p>
                                        <Reaction nbVote={post.nbVote} type={'post'} id={post.id} reaction={post.reaction} />
                                        {errorDeletePost && (<span className="text-red-400">{errorDeletePost}</span>)}
                                    </article>

                                )
                            })
                    }
                    {token && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col items-end gap-2">
                                <textarea className="w-full px-2 py-1 border rounded" placeholder="Ecrivez votre message" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
                                <button type="submit" className="border px-3 py-1 rounded border-green-500 bg-green-300 text-gray-50">Envoyer</button>
                                {loadingPost && (<span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>)}
                                {errorPost && (<span className="text-red-400">{{ errorPost }}</span>)}
                            </div>
                        </form>
                    )}
                </>
            )}
        </section>
    )
}

export default Thread;
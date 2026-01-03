import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../services/useFetch";
import ThreadComponent from "../components/ThreadComponent";
import SkeletonComponent from "../components/SkeletonComponent";
import { useUserCommunities } from "../context/UserCommunitiesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Community() {
    const params = useParams();
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL;
    const { communities, addCommunity, removeCommunity, token, isTokenExpired, logout } = useUserCommunities();
    const [refresh, setRefresh] = useState(0);
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const handleRefresh = () => setRefresh(prev => prev + 1);
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { data, loading, error } = useFetch(`${url}/api/community/${params.id}/threads?refresh=${refresh}`, options);
    const isUserCommunity = communities.some(
        (community) => community.id === Number(params.id)
    );

    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);

    function handleDelete() {
        setDeleteLoading(true);
        setDeleteError('');
        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        fetch(`${url}/api/community/${params.id}/delete`, options)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Erreur inconnue");
                }
                return data;
            })
            .then(() => {
                navigate(`/`, { replace: true });
            })
            .catch(err => setDeleteError(err.message))
            .finally(() => setDeleteLoading(false));
    }

    return (
        <section>
            {
                loading && (
                    <SkeletonComponent />
                )
            }
            {error && (
                <p>Erreur {error.status} : {error.message}</p>
            )}
            {data && (
                <>
                    <div id="title" className="flex gap-3 items-center">
                        <h1 className="text-primary-400 text-2xl">{data.community.name}</h1>
                        {deleteError && (<span className="text-red-400">{deleteError}</span>)}
                        {deleteLoading && (<span className="mr-3 size-5 animate-spin text-gray-800 text-center block">|</span>)}
                        <FontAwesomeIcon
                            className="text-sm cursor-pointer hover:text-gray-500"
                            icon={isUserCommunity ? faStarSolid : faStarRegular}
                            onClick={() => {
                                if (isUserCommunity) removeCommunity(params.id);
                                else addCommunity(data.community);
                            }}
                        />
                        {token && (
                            <>
                                <Link to={'/newThread'} title="Créer un thread" state={{ community: data?.community }}>
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                    />
                                </Link>
                                {
                                    data.community?.isAdmin && (
                                        <>
                                            <Link to={'/editCommunity'} state={{ community: data?.community }} title="Modifier la communauté"><FontAwesomeIcon icon={faPencil} /></Link>
                                            <span className="cursor-pointer" title="Supprimer la communauté" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></span>
                                        </>
                                    )
                                }
                            </>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {data.community.topics.map(topic => (
                            <span className="border-gray-50 border text-gray-400 bg-gray-100 rounded pl-2 pr-2" key={topic.id}>{topic.name}</span>
                        ))}
                    </div>

                    <p><span>Description : </span>{data.community.description}</p>
                    {data.threads.map(thread => (
                        <ThreadComponent key={thread.id} thread={thread} isCommentLink={true} onThreadDeleted={handleRefresh} />
                    ))}
                </>
            )}
        </section>
    )
}

export default Community;
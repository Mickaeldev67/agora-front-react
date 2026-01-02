import { useNavigate, useParams } from "react-router";
import useFetch from "../services/useFetch";
import Skeleton from "../components/SkeletonComponent";
import Reaction from "../components/Reaction";
import ThreadComponent from "../components/ThreadComponent";
import { useUserCommunities } from "../context/userCommunitiesContext";

function Thread () {
    const params = useParams();
    const url = import.meta.env.VITE_API_URL;
    const { token } = useUserCommunities();
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/thread/${params?.id}/posts`, options);
    const navigate = useNavigate();

    function handleRefresh() {
        navigate("/", { replace: true });
    }
    return (
        <section>
                <h1 className="text-primary-400 text-2xl">Thread</h1>

                {loading && (
                    <Skeleton />
                )}

                { error && (
                    <p>Erreur { error.status } : { error.message }</p>
                )}
                { data && (
                    <ThreadComponent thread={data.thread} id={data.thread.id} onThreadDeleted={handleRefresh}/>
                )}
                { data && (
                    <>
                        <h2 className="text-primary-400 text-xl">Comments</h2>
                        {
                            data.posts.length === 0 ? <p>Il n'y a pas de post sur ce thread, pourquoi ne pas vous lancer ?</p> 
                            : data.posts.map(post => (
                                <article className="border rounded p-4 mb-4 bg-gray-50" key={post.id}>
                                    <div className="text-xs">
                                        <span className="font-bold">{post.pseudo}</span> <span>{new Date(post.updatedAt ?? post.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <p>{post.content}</p>
                                    <Reaction nbVote={post.nbVote} type={'post'} id={post.id} reaction={post.reaction}/>
                                </article>
                            ))
                        }
                    </>
                )}
        </section>
    )
}

export default Thread;
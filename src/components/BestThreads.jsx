import { useUserCommunities } from "../context/userCommunitiesContext";
import useFetch from "../services/useFetch";
import Skeleton from './SkeletonComponent';
import Thread from "./ThreadComponent";

function Threads() {
    const url = import.meta.env.VITE_API_URL;
    const { token } = useUserCommunities();
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/thread/best-reacted`, options);
    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">Les meilleurs threads</h1>

            { error && (
                <p>Erreur { error.status } : { error.message }</p>
            )}

            {loading && (
                <Skeleton />
            )}

            {data && data.map(thread => (
                <Thread key={thread.id} thread={thread} isCommentLink={true}/>
            ))}
        </section>
    )
    
}

export default Threads;
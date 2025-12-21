import useFetch from "../services/useFetch";
import Skeleton from './SkeletonComponent';
import Thread from "./ThreadComponent";


function Threads() {
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(`${url}/thread/best-reacted`);
    return (
        <>
            <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Les meilleurs threads</h1>

                { error && (
                    <p>Erreur { error.status } : { error.message }</p>
                )}

                {loading && (
                    <Skeleton />
                )}

                {data && data.map(thread => (
                    <Thread key={thread.id} thread={thread} type={"thread"}/>
                ))}
            </main>

        </>
    )
    
}

export default Threads;
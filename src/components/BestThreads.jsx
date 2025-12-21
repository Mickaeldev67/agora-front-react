import useFetch from "../services/useFetch";
import Skeleton from 'react-loading-skeleton'
import ThreadComponent from "./ThreadComponent";


function Threads() {
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(`${url}/thread/best-reacted`);
    return (
        <>
            <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Les meilleurs threads</h1>

                {loading && (
                    <section className="border rounded p-4 mb-4 bg-gray-50">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                        <Skeleton height={24} />
                        <Skeleton height={20} />
                        <Skeleton height={20} width={70}/>
                    </section>
                )}

                {data && data.map(thread => (
                    <ThreadComponent key={thread.id} thread={thread}/>
                ))}
            </main>

        </>
    )
    
}

export default Threads;
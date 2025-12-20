import useFetch from "../services/useFetch";
import Skeleton from 'react-loading-skeleton'
import Reaction from "./Reaction";


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
                    <section key={thread.id} className="border rounded p-4 mb-4 bg-gray-50">
                        <div className="text-xs flex flex-col">
                            <div className="flex gap-2">
                                <span className="font-bold">{thread.community}</span>
                                <span>{new Date(thread.updatedAt ?? thread.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <span className="text-gray-400">{thread.pseudo}</span>
                        </div>

                        <span className="text-xl text-gray-800">{thread.title}</span>
                        <p className="text-gray-600">{thread.content}</p>

                        <Reaction nbPost={thread.nbPost} nbVote={thread.nbVote} threadId={thread.id}/> 
                    </section>
                ))}
            </main>

        </>
    )
    
}

export default Threads;
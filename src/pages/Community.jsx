import { useParams } from "react-router";
import Header from "../components/Header";
import useFetch from "../services/useFetch";
import ThreadComponent from "../components/ThreadComponent";
import Skeleton from "react-loading-skeleton";

function Community () {

    const params = useParams();
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(`${url}/community/${params.id}/threads`);
    return (
        <>
            <Header />
            <main className="bg-primary-50 p-8 h-[95vh]">
            {
                loading && (
                    <section className="border rounded p-4 mb-4 bg-gray-50">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                        <Skeleton height={24} />
                        <Skeleton height={20} />
                        <Skeleton height={20} width={70}/>
                    </section>
                )
            }
            { error && (
                <p>Erreur { error.status } : { error.message }</p>
            )}
            { data && (
                <>
                    <h1 className="text-primary-400 text-2xl">{data.community.name}</h1>
                    <div className="flex gap-3">
                        { data.community.topics.map(topic => (
                            <span className="border-gray-50 border text-gray-400 bg-gray-100 rounded pl-2 pr-2" key={topic.id}>{topic.name}</span>
                        ))}
                    </div>
                    
                    <p><span>Description : </span>{data.community.description}</p>
                        { data.threads.map(thread => (
                            <ThreadComponent key={thread.id} thread={thread} />
                        ))}
                </>
            )}

            </main>
        </>
    )
}

export default Community;
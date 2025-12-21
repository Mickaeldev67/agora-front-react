import { useParams } from "react-router";
import useFetch from "../services/useFetch";
import Header from "../components/Header";
import Skeleton from "react-loading-skeleton";
import Reaction from "../components/Reaction";
import ThreadComponent from "../components/ThreadComponent";

function Thread () {
    const params = useParams();
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(`${url}/thread/${params.id}/posts`);
    return (
        <>
            <Header />

            <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Thread</h1>

                {loading && (
                    <section className="border rounded p-4 mb-4 bg-gray-50">
                        <Skeleton height={10} width={120} />
                        <Skeleton height={10} width={80} />
                        <Skeleton height={24} />
                        <Skeleton height={20} />
                        <Skeleton height={20} width={70}/>
                    </section>
                )}

                { error && (
                    <p>Erreur { error.status } : { error.message }</p>
                )}
                { data && (
                    <ThreadComponent thread={data.thread}/>
                    /*
                    <section className="border rounded p-4 mb-4 bg-gray-50">
                        <div className="text-xs flex flex-col">
                            <div className="flex gap-2">
                                <span className="font-bold">{data.thread.communityName}</span>
                                <span>{new Date(data.thread?.updatedAt ?? data.thread?.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <span className="text-gray-400">{data.thread.pseudo}</span>
                        </div>

                        <span className="text-xl text-gray-800">{data.thread.title}</span>
                        <p className="text-gray-600">{data.thread.content}</p>

                        <Reaction nbVote={data.thread.nbVote} nbPost={data.thread.nbPost} />
                    </section>
                    */
                )}
                { data && data.posts.map(post => (
                    <section className="border rounded p-4 mb-4 bg-gray-50" key={post.id}>
                        <div className="text-xs">
                            <span className="font-bold">{post.pseudo}</span> <span>{new Date(post.updatedAt ?? post.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p>{post.content}</p>
                        <Reaction nbVote={post.nbVote} />
                    </section>
                ))}

            </main>
        </>
    )
}

export default Thread;
import { useParams } from "react-router";
import useFetch from "../services/useFetch";
import Header from "../components/Header";
import Skeleton from "../components/SkeletonComponent";
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
                    <Skeleton />
                )}

                { error && (
                    <p>Erreur { error.status } : { error.message }</p>
                )}
                { data && (
                    <ThreadComponent thread={data.thread}/>
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
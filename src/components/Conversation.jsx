import Skeleton from "react-loading-skeleton";
import { useUserCommunities } from "../context/UserCommunitiesContext";
import useFetch from "../services/useFetch";

function Conversation({ user }) {
    const { token } = useUserCommunities();
    const url = import.meta.env.VITE_API_URL;
    if (!user?.id) {
        return (<section>Sélectionne une conversation</section>);
    }

    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/message/${user.id}`, options);
    return (
        <section className="border rounded flex-1 h-[70vh]">
            {loading && (<Skeleton width={300} />)}
            {error && (<span className="text-red-400">Erreur {error.status} : {error.message}</span>)}
            {data && (
                <>
                    <h2 className="bg-gray-100 text-center">{user.pseudo}</h2>
                    {data.map(conversation => (
                        <div className={`flex p-3 ${conversation.issuer.pseudo === user.pseudo
                            ? "jusitfy-start"
                            : "justify-end"}`}
                        >
                            {console.log(conversation)}
                            <div className={`flex flex-col ${conversation.issuer.pseudo === user.pseudo
                            ? "items-start"
                            : "items-end"}`}>
                                <span className="text-xs text-gray-400">{new Date(conversation.created_at).toLocaleDateString('fr-FR')}</span>
                                <p
                                    className={`${conversation.issuer.pseudo === user.pseudo
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-300 text-gray-50"} 
                                rounded-full w-fit py-1 px-2`}
                                >{conversation.content}</p>
                            </div>
                            
                        </div>
                    ))}
                </>
            )}
        </section>
    )
}

export default Conversation;
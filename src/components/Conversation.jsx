import Skeleton from "react-loading-skeleton";
import { useUserCommunities } from "../context/UserCommunitiesContext";
import useFetch from "../services/useFetch";
import { useState, useEffect } from "react";

function Conversation({ user }) {
    const { token, user: me } = useUserCommunities();
    const [messageToSend, setMessageToSend] = useState('');
    const [sendError, setSendError] = useState('');
    const [messages, setMessages] = useState([]);
    const url = import.meta.env.VITE_API_URL;
    const hubUrl = import.meta.env.VITE_MERCURE_URL;

    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(
        user?.id ? `${url}/api/message/${user.id}` : null,
        options
    );

    useEffect(() => {
        if (data) setMessages(data);
    }, [data]);

    /* Mercure */
    useEffect(() => {
        if (!user?.id || !me?.id) return;
        const topic = `conversation-${Math.min(user.id, me.id)}-${Math.max(user.id, me.id)}`;
        const url = new URL(hubUrl);
        url.searchParams.append('topic', topic);

        const es = new EventSource(url, { withCredentials: true });

        es.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        return () => es.close();
    }, [user]);

    function handleSubmit(e) {
        e.preventDefault();
        setSendError('');

        if (!messageToSend.trim()) return;

        fetch(`${url}/api/message/send/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                content: messageToSend,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur envoi message");
                return res.json();
            })
            .then((newMessage) => {
                setMessageToSend(""); 
            })
            .catch(err => setSendError(err));
    }
    return (
        <div className="flex flex-col flex-1 h-[70vh]">
            <h2 className="bg-gray-100 text-center">{user.pseudo}</h2>
            <section className="border rounded flex-1 overflow-auto">
                {loading && (<Skeleton width={300} />)}
                {error && (<span className="text-red-400">Erreur {error.status} : {error.message}</span>)}
                {messages && (
                    <>
                        {messages.map((conversation, index) => {
                            const isLastMessage = index === data.length - 1;
                            const isSentByMe = conversation.issuer?.id === me?.id;
                            const isViewed = conversation.is_view === true;

                            return (
                                <div
                                    key={conversation.id ? conversation.id : `${conversation.created_at}-${index}`}
                                    className={`flex p-3 ${isSentByMe ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"
                                            }`}
                                    >
                                        <span className="text-xs text-gray-400">
                                            {new Date(conversation.created_at).toLocaleString("fr-FR")}
                                        </span>

                                        <p
                                            className={`rounded-full w-fit py-1 px-2 ${isSentByMe
                                                    ? "bg-blue-400 text-gray-50"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {conversation.content}
                                        </p>
                                        {isSentByMe && isLastMessage && isViewed && (
                                            <span className="text-xs text-gray-400 mt-1">
                                                Vu
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </section>
            <section>
                <form onSubmit={handleSubmit} className="flex flex-col items-end">
                    <textarea type="text" className="border rounded w-full max-h-66 px-2 py-1"
                        placeholder="Écris ton message…"
                        value={messageToSend}
                        onChange={e => setMessageToSend(e.target.value)}></textarea>

                    <button
                        type="submit"
                        className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Envoyer
                    </button>
                </form>

            </section>
        </div>
    )
}

export default Conversation;
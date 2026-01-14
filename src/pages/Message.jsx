import { useEffect, useState } from "react";
import { useUserCommunities } from "../context/UserCommunitiesContext";
import useFetch from "../services/useFetch";
import Skeleton from "react-loading-skeleton";
import Conversation from "../components/Conversation";
import { useLocation } from "react-router";

function Message() {
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    const location = useLocation();
    const userState = location.state?.user;
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(userState ?? null);
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/message/pseudos`, options);
    useEffect(() => {
        if (!data) return;

        setUsers(prev => {
            // si on vient d'une autre page avec un user
            if (userState && !data.some(u => u.id === userState.id)) {
                return [userState, ...data];
            }
            return data;
        });

        // sélection automatique
        if (userState) {
            setUser(userState);
        } else if (data.length > 0) {
            setUser(data[0]);
        }
    }, [data, userState]);
    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">
                Message
            </h1>
            <div className="flex mt-3">
                <aside className="w-33 flex flex-col">
                    {loading && (
                        <Skeleton width={110} />
                    )}
                    {error && (
                        <span className="text-red-400">Erreur {error.status} : {error.message}</span>
                    )}
                    {users.length > 0 && users.map(u => (
                        <span
                            className={`border rounded px-2 py-1 cursor-pointer hover:bg-gray-200
                            ${u?.id === user.id ? "bg-gray-300" : ""}`}
                            onClick={() => setUser(u)}
                            key={u.id}
                        >{u.pseudo}</span>
                    ))
                    }
                </aside>
                <Conversation user={user} />
            </div>


        </section>
    );
}

export default Message;
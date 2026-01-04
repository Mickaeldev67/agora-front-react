import { useEffect, useState } from "react";
import { useUserCommunities } from "../context/UserCommunitiesContext";
import useFetch from "../services/useFetch";
import Skeleton from "react-loading-skeleton";
import Conversation from "../components/Conversation";

function Message() {
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    const [user, setUser] = useState({});
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/message/pseudos`, options);
    useEffect(() => {
        if (data && data.length > 0) {
            setUser(data[0]);
        }
    }, [data]);
    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">
                Message
            </h1>
                <div className="flex mt-3">
                    <aside className="w-33">
                        {loading && (
                            <Skeleton width={110} />
                        )}
                        {error && (
                            <span className="text-red-400">Erreur {error.status} : {error.message}</span>
                        )}
                        {data && data.map(user => (
                                <span 
                                className="border rounded px-2 py-1 cursor-pointer hover:bg-gray-200" 
                                onClick={()=> setUser(user)} 
                                key={user.id}
                                >{user.pseudo}</span>
                            ))
                        }
                    </aside>
                    <Conversation user={user}/>
                </div>
            
            
        </section>
    );
}

export default Message;
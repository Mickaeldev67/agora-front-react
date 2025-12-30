import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../services/useFetch";

const UserCommunitiesContext = createContext();

export function UserCommunitiesProvider({ children }) {
    const [communities, setCommunities] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!token) {
            setCommunities([]); // vide les communautés si on se déconnecte
        }
    }, [token]);

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setCommunities([]);
    }

    function login(newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const { data } = useFetch(
        token ? `${url}/api/user/communities` : null,
        token
            ? {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            : null
    );

    useEffect(() => {
        if (data) setCommunities(data);
        else setCommunities([]);
    }, [data]);

    async function addCommunity(community) {
        try {
            await fetch(`${url}/api/community/add-favorite`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ community_id: community.id })
            });

            setCommunities(communities => [...communities, { id: community.id, name: community.name }]);
        } catch (err) {
            console.error("Erreur ajout favori", err);
        }
    }

    async function removeCommunity(id) {
        try {
            await fetch(`${url}/api/community/${id}/delete-favorite`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCommunities(prev =>
                prev.filter(community => community.id !== Number(id))
            );
        } catch (err) {
            console.error("Erreur suppression favori", err);
        }
    }

    function isFavorite(id) {
        return communities.some(c => c.id === Number(id));
    }

    return (
        <UserCommunitiesContext.Provider
            value={{ communities, addCommunity, removeCommunity, isFavorite, token, logout, login }}
        >
            {children}
        </UserCommunitiesContext.Provider>
    );
}

export function useUserCommunities() {
    return useContext(UserCommunitiesContext);
}
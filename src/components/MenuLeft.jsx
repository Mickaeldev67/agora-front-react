import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import useFetch from "../services/useFetch";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserCommunities } from "../context/UserCommunitiesContext";

function MenuLeft () {
    const [isContentOpen, setIsContentOpen] = useState(true);
    const { communities, setCommunities } = useUserCommunities();
    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(
        token ? `${url}/api/user/communities` : null,
        token
        ? {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        : null
    );
    useEffect(() => {
        if (data) {
            setCommunities(data);
        }
    }, [data]);
    function burgerToggler() {
        setIsContentOpen(!isContentOpen);
    }

    return (
        <aside className="h-full pt-8 pb-8 pr-4 pl-4 border-r border-gray-300 relative">
            <FontAwesomeIcon 
                className={`${isContentOpen ? 'right-[-9%]' : 'right-[-48%]'} absolute text-gray-50 bg-gray-400 p-1 rounded-3xl text-lg cursor-pointer`}
                icon={faBurger} 
                onClick={burgerToggler}
            />
            <div className={isContentOpen ? "px-3" : "hidden"}>
                <h2 className="text-gray-400">Mes communautés</h2>
                <ul>
                    {loading && (
                        <Skeleton height={24} />
                    )}
                    {data && (
                        <>
                        {data.map((community) => (
                            <li key={community.id} className="flex justify-between items-center">
                                <Link className="py-1 hover:text-gray-300" to={`/community/${community.id}`}>{community.name}</Link>
                                {/* TODO : suppression a implémenter */}
                                <FontAwesomeIcon icon={faStar} />
                            </li>
                        ))}
                        </>
                    )}
                </ul>
            </div>
        </aside>
    )
}

export default MenuLeft;
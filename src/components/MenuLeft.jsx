import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserCommunities } from "../context/UserCommunitiesContext";

function MenuLeft () {
    const [isContentOpen, setIsContentOpen] = useState(true);
    const { communities, removeCommunity } = useUserCommunities();
    function burgerToggler() {
        setIsContentOpen(!isContentOpen);
    }

    return (
        <aside className={`${isContentOpen && 'w-66'} h-full pt-8 pb-8 pr-4 pl-4 border-r border-gray-300 relative`}>
            <FontAwesomeIcon 
                className={`${isContentOpen ? 'right-[-6%]' : 'right-[-48%]'} absolute text-gray-50 bg-gray-400 p-1 rounded-3xl text-lg cursor-pointer`}
                icon={faBurger} 
                onClick={burgerToggler}
            />
            <div className={isContentOpen ? "px-3" : "hidden"}>
                <h2 className="text-gray-400">Mes communautés</h2>
                <ul>
                    {communities && (
                        <>
                        {communities.map((community) => (
                            <li key={community.id} className="flex justify-between items-center">
                                <Link className="py-1 hover:text-gray-300 w-full" to={`/community/${community.id}`}>{community.name}</Link>
                                {/* TODO : suppression a implémenter */}
                                <span title="Retirer des favoris"><FontAwesomeIcon className="hover:text-gray-500 cursor-pointer" icon={faStar} onClick={() => removeCommunity(community.id)} /></span>
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
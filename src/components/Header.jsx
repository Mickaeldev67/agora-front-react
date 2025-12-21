import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useFetch from "../services/useFetch";
import { Link } from "react-router";

function Header() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const { data, loading, error } = useFetch(
        debouncedSearch ? `${url}/search` : null, 
        debouncedSearch ? {
            'method': 'Post',
            'body': {
                'query': debouncedSearch,
            } 
        } :null
    );

    function searchingAPostOrACommunity(e) {
        setSearch(e.target.value);
    }

    function resetSearchBar() {
        setSearch('');
        setDebouncedSearch('');
    }

    return (
        <>
            <header className="flex justify-between items-center bg-primary-400 p-2 pl-5 pr-5 text-primary-50 h-[5vh]">
                <Link to={'/'}><span>Agora</span></Link>
                <div className="relative">
                    <div className="w-[33vw]">
                        <input value={search} onChange={searchingAPostOrACommunity} className="p-2 bg-gray-50 text-gray-400 rounded w-full" type="text" placeholder="Entrez votre recherche" />
                    </div>
                    {loading && (
                        <div className="absolute bg-gray-50 text-gray-400 left-0 right-0 rounded border">
                            Chargement...
                        </div>
                    )}

                    {!loading && data && debouncedSearch != '' && (
                        <div className="absolute bg-gray-50 text-gray-400 left-0 right-0 rounded border">
                            {data.communities.length > 0 && (
                                <>
                                    <div className="flex justify-center">
                                        <span>Communities</span>
                                    </div>
                                    {data.communities.map((community) => (
                                        <Link key={ community.id } to={`/community/${community.id}`} onClick={resetSearchBar}>
                                            <div  className="hover:bg-gray-100 p-4 rounded">
                                                <span className="text-gray-600">{ community.name }</span>
                                                <p>{ community.description }</p>
                                            </div>
                                        </Link>
                                    ))}
                                </>
                            )}
                            {data.threads.length > 0 && (
                                <>
                                    <div className="flex justify-center">
                                        <span>Threads</span>
                                    </div>
                                    {data.threads.map((thread) => (
                                        <Link key={ thread.id } to={`/thread/${thread.id}`} onClick={resetSearchBar}>
                                            <div  className="hover:bg-gray-100 p-4 rounded">
                                                <span className="text-gray-600">{ thread.title }</span>
                                                <p>{ thread.content }</p>
                                            </div>
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faPlus} title="Créer une communauté"/>
                    <FontAwesomeIcon icon={faMessage} title="Aller à la messagerie"/>
                    <FontAwesomeIcon icon={faUser} title="Login"/>
                </div>
            </header>
            
        </>
    )
}

export default Header;
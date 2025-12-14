import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useFetch from "../services/useFetch";

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

    console.log('loading', loading);
    console.log(data);

    function searchingAPostOrACommunity(e) {
        setSearch(e.target.value);
    }

    return (
        <>
            <header className="flex justify-between items-center bg-primary-400 p-2 pl-5 pr-5 text-primary-50 h-[5vh]">
                <span>Agora</span>
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
                            {data.communities && (
                                <>
                                    <div className="flex justify-center">
                                        <span>Communities</span>
                                    </div>
                                    {data.communities.map((community) => (
                                        <div key={ community.id } className="hover:bg-gray-100 p-4 rounded">
                                            <span className="text-gray-600">{ community.name }</span>
                                            <p>{ community.description }</p>
                                        </div>
                                    ))}
                                </>
                            )}
                            {data.threads && (
                                <>
                                    <div className="flex justify-center">
                                        <span>Threads</span>
                                    </div>
                                    {data.threads.map((thread) => (
                                        <div key={ thread.id } className="hover:bg-gray-100 p-4 rounded">
                                            <span className="text-gray-600">{ thread.title }</span>
                                            <p>{ thread.content }</p>
                                        </div>
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
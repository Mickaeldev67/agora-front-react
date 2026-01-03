import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useFetch from "../services/useFetch";
import { Link } from "react-router";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useUserCommunities } from "../context/userCommunitiesContext";

function Header() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isLoginBoxOpen, setIsLoginBoxOpen] = useState(false);
    const url = import.meta.env.VITE_API_URL;
    const { logout, token} = useUserCommunities();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        

        return () => {
            clearTimeout(timeout);
        };
    }, [search]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!e.target.closest('#loginBox') && !e.target.closest('#btnLogin')) {
                setIsLoginBoxOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                
                <div className="flex gap-4 relative items-center h-[5vh]">
                    <div className={`w-33 flex ${token ? 'justify-between' : 'justify-end'} items-center`}>
                        { token && (
                            <>
                                <Link to={'/newCommunity'} title="Créer une communauté"><FontAwesomeIcon icon={faPlus}/></Link>
                                <FontAwesomeIcon className="cursor-pointer" icon={faMessage} title="Aller à la messagerie"/>
                            </>
                        )}
                        {!token && (
                            <FontAwesomeIcon id="btnLogin" className="cursor-pointer" onClick={() => setIsLoginBoxOpen(isOpen => !isOpen)} icon={faUser} title="Login"/>
                        )}

                        {token && (
                            <FontAwesomeIcon icon={faRightFromBracket} className="cursor-pointer" onClick={logout}/>
                        )}
                    </div>
                    {isLoginBoxOpen && (
                        <div id="loginBox" className="absolute rounded top-full bg-primary-50 border border-gray-400 left-0 right-0 text-gray-700">
                            <Link to={'/register'}><button className="pt-1 w-full pb-1 hover:bg-primary-300 hover:cursor-pointer">S'inscrire</button></Link>
                            <Link to={'/login'}><button className="pt-1 w-full pb-1 hover:bg-primary-300 hover:cursor-pointer">Se connecter</button></Link>
                        </div>
                    )}
                </div>
                
            </header>
            
        </>
    )
}

export default Header;
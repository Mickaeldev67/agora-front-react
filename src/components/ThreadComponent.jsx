import { Link, useNavigate } from "react-router";
import Reaction from "./Reaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useUserCommunities } from "../context/userCommunitiesContext";

function ThreadComponent({ thread: { id, community, updatedAt, createdAt, user, title, content, nbVote, nbPost, reaction }, isCommentLink, onThreadDeleted }) {
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
        useEffect(() => {
            if (token && isTokenExpired(token)) {
                logout();
            }
        }, [token, logout, isTokenExpired]);
    const thread = {
        id,
        community,
        updatedAt,
        createdAt,
        user,
        title,
        content,
        nbVote,
        nbPost,
        reaction,
    };
    useEffect(() => {
        function handleClickOutside(e) {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setIsOpenSettings(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function deleteThread() {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };
        fetch(`${url}/api/thread/delete/${id}`, options)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Erreur inconnue");
                }
                return data;
            })
            .then(() => {
                if (onThreadDeleted) onThreadDeleted();
            })
            .catch(err => console.error(err.message));
    }

    return(
        <article key={refreshKey} className="border rounded p-4 mb-4 bg-gray-100">
            <div className="text-xs flex justify-between items-center">
                <div className=" flex flex-col">
                    <div className="flex gap-2">
                        {community && (<Link to={`/community/${community.id}`}><span className="font-bold">{community.name}</span></Link>)}
                        <span className="text-gray-400">{new Date(updatedAt ?? createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span className="text-gray-400">{user.pseudo}</span>
                </div>
                { (user?.isOwner || user?.isAdmin) && (
                <div className="relative text-base" ref={settingsRef}>
                    <FontAwesomeIcon className="hover:text-gray-300 cursor-pointer" icon={faEllipsisVertical} onClick={() => {
                        isOpenSettings ? setIsOpenSettings(false) : setIsOpenSettings(true);
                    }}/>
                    {isOpenSettings && (
                        <div className="absolute flex flex-col right-0 bg-gray-50 border rounded py-1 px-2">
                            {user?.isOwner && (<Link className="hover:text-gray-300" to={'/editThread'} state={{ thread: thread }}><span>Modifier</span></Link>)}
                            {(user?.isOwner || user?.isAdmin) && (<span className="hover:text-gray-300 cursor-pointer" onClick={() => deleteThread()}>Supprimer</span>)}
                        </div>
                    )}
                </div> 
                )}
                
            </div>

            <span className="text-xl text-gray-800">{title}</span>
            <p className="text-gray-600">{content}</p>

            <Reaction nbVote={nbVote} nbPost={nbPost} id={id} type={"thread"} isCommentLink={isCommentLink} reaction={reaction}/>
        </article>
    );
}

export default ThreadComponent;
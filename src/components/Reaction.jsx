import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faComment, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import { useState } from "react";
import { useUserCommunities } from "../context/userCommunitiesContext";


function Reaction({ nbVote: initialVote, nbPost, id, type, isCommentLink, reaction }) {
    const url = import.meta.env.VITE_API_URL;
    const [nbVote, setNbVote] = useState(initialVote || 0);
    const [isLiked, setIsLiked] = useState(reaction?.isLiked || false);
    const [isDisliked, setIsDisliked] = useState(reaction?.isDisliked || false);
    const [loading, setLoading] = useState(false);
    const { token } = useUserCommunities();
    const [error, setError] = useState(null);

    const sendReaction = async (actionType) => {
        if (loading || !token) return;
        setLoading(true);

        try {
            const body = { type, id };
            if (actionType === "like") body.isLiked = !isLiked;
            if (actionType === "dislike") body.isDisliked = !isDisliked;

            const res = await fetch(`${url}/api/reaction/${actionType}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (result?.reaction) {
                setIsLiked(Boolean(result.reaction.isLiked));
                setIsDisliked(Boolean(result.reaction.isDisliked));
                setNbVote(result.nbVote ?? nbVote);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-500">
            <FontAwesomeIcon className={`${token && !loading ? "cursor-pointer" : ""} ${isLiked ? "text-blue-700" : "text-gray-600"}`} icon={faArrowUp} onClick={() => sendReaction('like')} />
            {nbVote > 0 && (<span>{nbVote}</span>)}
            <FontAwesomeIcon className={`${token && !loading ? "cursor-pointer" : ""} ${isDisliked ? "text-blue-700" : "text-gray-600"}`} icon={faArrowDown} onClick={() => sendReaction('dislike')} />
            {nbVote <= 0 && (<span>{nbVote}</span>)}
            {isCommentLink && type === "thread" && (
                <Link to={`/thread/${id}`}>
                    <FontAwesomeIcon icon={faComment} />
                    <span>{nbPost}</span>
                </Link>
            )}
            {!isCommentLink && type === "thread" && (
                <>
                    <FontAwesomeIcon icon={faComment} />
                    <span>{nbPost}</span>
                </>
            )}
            {error && (
                error.message
            )}
        </div>
    )
}

export default Reaction;
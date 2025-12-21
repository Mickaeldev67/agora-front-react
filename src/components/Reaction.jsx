import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faComment, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

function Reaction({ nbVote, nbPost, threadId, type }) {
    return(
        <div className="text-gray-500">
            <FontAwesomeIcon icon={faArrowUp} />
            {nbVote > 0 && (<span>{nbVote}</span>)}
            <FontAwesomeIcon icon={faArrowDown} />
            {nbVote <= 0 && (<span>{nbVote}</span>)}
            {threadId && type === "thread" && (
                <Link to={`/thread/${threadId}`}>
                <FontAwesomeIcon icon={faComment} />
                <span>{nbPost}</span>
                </Link>
            )}
            {!threadId && type === "thread" && (
                <>
                    <FontAwesomeIcon icon={faComment} />
                    <span>{nbPost}</span>
                </>
            )}
            {/* // Quel sont les possibilités : Une réaction peut être => 
            Un thread avec un threadId 
            Un thread sans threadID 
            Un type post  */}
        </div>
    )
}

export default Reaction;
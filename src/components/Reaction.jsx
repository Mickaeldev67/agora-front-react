import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faComment, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

function Reaction({ nbVote, nbPost, threadId }) {
    return(
        <div className="text-gray-500">
            <FontAwesomeIcon icon={faArrowUp} />
            {nbVote > 0 && (<span>{nbVote}</span>)}
            <FontAwesomeIcon icon={faArrowDown} />
            {nbVote <= 0 && (<span>{nbVote}</span>)}
            {(nbPost ?? 0) >= 0 && (
                threadId ? (
                    <Link to={`/thread/${threadId}`}>
                    <FontAwesomeIcon icon={faComment} />
                    <span>{nbPost}</span>
                    </Link>
                ) : (
                    <>
                    <FontAwesomeIcon icon={faComment} />
                    <span>{nbPost}</span>
                    </>
                )
            )}
        </div>
    )
}

export default Reaction;
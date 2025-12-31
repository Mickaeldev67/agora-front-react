import { Link } from "react-router";
import Reaction from "./Reaction";

function ThreadComponent({ thread: { id, community, updatedAt, createdAt, user, title, content, nbVote, nbPost, reaction }, isCommentLink }) {
    return(
        <article className="border rounded p-4 mb-4 bg-gray-100">
            <div className="text-xs flex flex-col">
                <div className="flex gap-2">
                    {community && (<Link to={`/community/${community.id}`}><span className="font-bold">{community.name}</span></Link>)}
                    <span className="text-gray-400">{new Date(updatedAt ?? createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <span id={user.id} className="text-gray-400">{user.pseudo}</span>
            </div>

            <span className="text-xl text-gray-800">{title}</span>
            <p className="text-gray-600">{content}</p>

            <Reaction nbVote={nbVote} nbPost={nbPost} id={id} type={"thread"} isCommentLink={isCommentLink} reaction={reaction}/>
        </article>
    );
}

export default ThreadComponent;
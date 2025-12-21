import Reaction from "./Reaction";

function ThreadComponent({ thread: { communityName, updatedAt, createdAt, pseudo, title, content, nbVote, nbPost } }) {
    return(
        <section className="border rounded p-4 mb-4 bg-gray-50">
            <div className="text-xs flex flex-col">
                <div className="flex gap-2">
                    <span className="font-bold">{communityName}</span>
                    <span>{new Date(updatedAt ?? createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="text-gray-400">{pseudo}</span>
            </div>

            <span className="text-xl text-gray-800">{title}</span>
            <p className="text-gray-600">{content}</p>

            <Reaction nbVote={nbVote} nbPost={nbPost} />
        </section>
    );
}

export default ThreadComponent;
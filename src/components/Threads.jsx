import useFetch from "../services/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faComment, faArrowDown } from "@fortawesome/free-solid-svg-icons";


function Threads () {
    const url = import.meta.env.VITE_API_URL;
    const { data , loading, error } = useFetch(`${url}/thread/best-reacted`);
    
    console.log(data);
    console.log();
    return (
        <>
            <main className="bg-primary-50 p-8 h-[95vh]">
                <h1 className="text-primary-400 text-2xl">Les meilleurs threads</h1>
                {loading && <p>Chargement... Veuillez patienter</p>}
                {data && data.map((thread) => (
                    <section key={thread.id} className="border rounded p-4 mb-4 bg-gray-50">
                        <div className="flex text-xs flex flex-col">
                            <div className="flex gap-2">
                                <span className="font-bold">{thread.community}</span>
                                <span>{thread.createdAt}</span> 
                            </div>
                            <span className="text-gray-400">{thread.pseudo}</span>
                        </div>
                        <span className="text-xl text-gray-800">{thread.title}</span>
                        <p className="text-gray-600">{thread.content}</p>
                        {thread.nbVote > 0 ? (
                            <div className="text-gray-500">
                                <FontAwesomeIcon icon={faArrowUp} className="" /><span>{thread.nbVote}</span>
                                <FontAwesomeIcon icon={faArrowDown} />
                                <FontAwesomeIcon icon={faComment} /><span>{thread.nbPost}</span>
                            </div>
                            ) : (
                            <div className="text-gray-500" >
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} /><span>{thread.nbVote}</span>       
                                <FontAwesomeIcon icon={faComment} /><span>{thread.nbPost}</span>                         
                            </div>
                        )}   
                    </section>
                ))}
            </main>
            
        </>
    )
}

export default Threads;
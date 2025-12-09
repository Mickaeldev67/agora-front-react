import useFetch from "../services/useFetch";


function Threads () {
    const url = import.meta.env.VITE_API_URL;
    console.log(url);
    const { data , loading, error } = useFetch(`${url}/thread/best-reacted`);
    
    console.log(data);
    console.log();
    return (
        <>
            <h1>Les meilleurs threads</h1>
            {data && data.map((thread) => (
                <li key={thread.id}>
                    {thread.title} ({thread.content}) ({thread.pseudo}) ({thread.createdAt}) ({thread.nbVote})
                </li>
            ))}
        </>
    )
}

export default Threads;
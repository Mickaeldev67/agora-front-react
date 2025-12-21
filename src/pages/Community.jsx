import { useParams } from "react-router";
import Header from "../components/Header";

function Community () {

    const params = useParams();
    const url = import.meta.env.VITE_API_URL;
    const { data, loading, error } = useFetch(`${url}/api/community/${params.id}/threads`);
    return (
        <>
            <Header />
            { error && (
                <p>Erreur { error.status } : { error.message }</p>
            )}
            { data && (
                <>
                    {console.log(data)}
                </>
            )}
        </>
    )
}

export default Community;
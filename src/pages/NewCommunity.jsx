import { useState, useEffect } from "react";
import { useUserCommunities } from "../context/userCommunitiesContext";
import Skeleton from "react-loading-skeleton";
import useFetch from "../services/useFetch";
import { useNavigate } from "react-router";

function NewCommunity() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, isTokenExpired, logout]);
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/category/display`, options);
    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !description || selectedTopics.length === 0) {
            alert("Veuillez remplir tous les champs et choisir au moins un topic.");
            return;
        }

        const body = {
            name,
            description,
            topics: selectedTopics.map(topic => topic.id),
        };

        setCreateLoading(true);
        setCreateError("");

        fetch(`${url}/api/community/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    // on remonte le message du back
                    throw new Error(data.message);
                }

                return data;
            })
            .then((result) => {
                navigate(`/community/${result.id}`);
            })
            .catch(err => {
                setCreateError(err.message);
            })
            .finally(() => setCreateLoading(false));
    }

    function handleName(e) {
        setName(e.target.value);
    }

    function handleDescription(e) {
        setDescription(e.target.value);
    }
    function toggleTopic(topic) {
        setSelectedTopics(prev => {
            const exists = prev.find(t => t.id === topic.id);

            // si déjà sélectionné → on enlève
            if (exists) {
                return prev.filter(t => t.id !== topic.id);
            }

            return [...prev, topic];
        });
    }

    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">
                Création d'une communauté
                <form className="text-base flex flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="name">Nom de la communauté</label>
                    <input className="border rounded py-1 px-2" type="text" id="name" value={name} onChange={handleName} />
                    <label htmlFor="name">Description de la communauté</label>
                    <input className="border rounded py-1 px-2" type="text" id="description" value={description} onChange={handleDescription} />
                    <label>Topics</label>
                    {loading && (
                        <Skeleton width={80} />
                    )}
                    {error && (<span className="text-red-400">{error.status} : {error.message}</span>)}
                    {console.log(data)}
                    <div className="flex gap-2 flex-wrap">
                        {selectedTopics.map(topic => (
                            <span
                                key={topic.id}
                                className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit"
                            >
                                {topic.name}
                                <button
                                    type="button"
                                    onClick={() => toggleTopic(topic)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    X
                                </button>
                            </span>
                        ))}
                    </div>
                    {data && data.map(category => (
                        <div key={category.id}>
                            <span>{category.name}</span>

                            <div className="flex gap-2 flex-wrap">
                                {category.topics && category.topics.map(topic => {
                                    const checked = selectedTopics.some(t => t.id === topic.id);
                                    return (
                                        <label
                                            key={topic.id}
                                            className={`px-3 py-1 rounded-full cursor-pointer text-sm border
                                            ${checked
                                                    ? "bg-primary-500 text-white border-primary-500"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={checked}
                                                onChange={() => toggleTopic(topic)}
                                            />
                                            {topic.name}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col items-center justify-center">
                        <button type="submit" className="border px-3 py-1 rounded border-green-500 bg-green-300 text-gray-50">Créer</button>
                        {createLoading && (
                            <span className="mr-3 size-5 animate-spin text-gray-800 text-center">|</span>
                        )}
                        {createError && (
                            <span className="text-red-400">{createError}</span>
                        )}
                    </div>

                </form>
            </h1>
        </section>
    )
}

export default NewCommunity;
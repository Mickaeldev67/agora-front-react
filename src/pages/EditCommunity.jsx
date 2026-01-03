import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUserCommunities } from "../context/userCommunitiesContext";
import { useState } from "react";
import useFetch from "../services/useFetch";
import Skeleton from "react-loading-skeleton";

function EditCommunity() {
    const location = useLocation();
    const navigate = useNavigate();
    const community = location.state?.community;
    const url = import.meta.env.VITE_API_URL;
    const { token, isTokenExpired, logout } = useUserCommunities();
    const [name, setName] = useState(community.name);
    const [description, setDescription] = useState(community.description);
    const [selectedTopics, setSelectedTopics] = useState(community?.topics || []);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");

    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data, loading, error } = useFetch(`${url}/api/category/display`, options);

    useEffect(() => {
        if (token && isTokenExpired(token)) {
            logout();
        }
    }, [token, logout, isTokenExpired]);

    useEffect(() => {
        if (!community || (!community.isAdmin)) {
            navigate('/'); 
        }
    }, [community, navigate]);

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

        setUpdateLoading(true);
        setUpdateError("");

        fetch(`${url}/api/community/${community.id}/edit`, {
            method: "PUT", // ou PATCH selon ton API
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then(result => {
                navigate(`/community/${result.id}`);
            })
            .catch(err => setUpdateError(err.message))
            .finally(() => setUpdateLoading(false));
    }

    function toggleTopic(topic) {
        setSelectedTopics(prev => {
            const exists = prev.find(t => t.id === topic.id);
            if (exists) return prev.filter(t => t.id !== topic.id);
            return [...prev, topic];
        });
    }

    return (
        <section className="pt-8 pb-8">
            <h1 className="text-primary-400 text-2xl">Modification de la communauté</h1>
            <form className="text-base flex flex-col" onSubmit={handleSubmit}>
                <label>Nom de la communauté</label>
                <input
                    className="border rounded py-1 px-2"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label>Description de la communauté</label>
                <input
                    className="border rounded py-1 px-2"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <label>Topics</label>
                {loading && <Skeleton width={80} />}
                {error && <span className="text-red-400">{error.status} : {error.message}</span>}

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

                <div className="flex flex-col items-center justify-center mt-4">
                    <button
                        type="submit"
                        className="border px-3 py-1 rounded border-blue-500 bg-blue-300 text-gray-50 cursor-pointer"
                        disabled={updateLoading}
                    >
                        Modifier
                    </button>
                    {updateLoading && <span className="animate-spin mt-2 text-gray-800">|</span>}
                    {updateError && <span className="text-red-400">{updateError}</span>}
                </div>
            </form>
        </section>
    );
}

export default EditCommunity;
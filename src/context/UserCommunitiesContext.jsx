import { createContext, useContext, useState } from "react";

const UserCommunitiesContext = createContext(null);

export function UserCommunitiesProvider({ children }) {
    const [communities, setCommunities] = useState([]);

    return (
        <UserCommunitiesContext.Provider value={{ communities, setCommunities }}>
            {children}
        </UserCommunitiesContext.Provider>
    );
}

export function useUserCommunities() {
    return useContext(UserCommunitiesContext);
}
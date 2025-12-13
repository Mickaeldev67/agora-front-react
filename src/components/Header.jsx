import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";

function Header() {
    return (
        <>
            <header className="flex justify-between items-center bg-primary-400 p-2 pl-5 pr-5 text-primary-50 h-[5vh]">
                <span>Agora</span>
                <div>
                    <input className="p-2 bg-primary-50 text-primary-400 rounded w-[33vw]" type="text" placeholder="Entrez votre recherche" />
                </div>
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faPlus} title="Créer une communauté"/>
                    <FontAwesomeIcon icon={faMessage} title="Aller à la messagerie"/>
                    <FontAwesomeIcon icon={faUser} title="Login"/>
                </div>
            </header>
        </>
    )
}

export default Header;
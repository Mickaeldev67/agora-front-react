function Header() {
    return (
        <>
            <header className="flex justify-between bg-midnight p-2 text-white">
                <span>Agora</span>
                <div className="">
                    <input type="text" placeholder="Entrez votre recherche" />
                </div>
                <div>
                    <button>Se connecter</button>
                    <button>Messagerie</button>
                    <button>Créer une communauté</button>
                </div>
            </header>
        </>
    )
}

export default Header;
function Header() {
    return (
        <>
            <header className="flex justify-between bg-[#c22c2c] p-2">
                <span>Agora</span>
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
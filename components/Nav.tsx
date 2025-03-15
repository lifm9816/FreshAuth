interface NavProps {
    LoggedIn: boolean;
}

export default function Nav ( { LoggedIn } : NavProps ){
    const menus = [
        { name: "Inicio", href: "/"},
    ];

    const loggedInMenus = [
        { name: "Secreto", href: "auth/secret" },
        { name: "Cerrar sesión", href: "/logout" }
    ];

    const nonLoggedInMenus = [
        { name: "Iniciar sesión", href: "/login" },
        { name: "Registrarse", href: "/signup" }
    ];

    return (
        <div class = "bg-slate-900 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class = "text-2xl ml-1 font-bold text-white">
                Fresh
            </div>
            <ul class = "flex gap-6">
                { menus.map((menu) => (
                    <li>
                        <a href = { menu.href } class = "text-white hover:text-white-700 py-1 border-gray-900">
                            { menu.name }
                        </a>
                    </li>
                ))}

                { LoggedIn ? (loggedInMenus.map((menu) => (
                    <li>
                        <a href = { menu.href } class = "text-white hover:text-white-700 py-1 border-gray-900">
                            { menu.name }
                        </a>
                    </li>
                ))
                ) : (
                    nonLoggedInMenus.map((menu) => (
                        <li>
                            <a href = { menu.href } class = "text-white hover:text-white-700 py-1 border-gray-900">
                                { menu.name }
                            </a>
                        </li>
                )))}
            </ul>
        </div>
    );
}
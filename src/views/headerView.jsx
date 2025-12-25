import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function HeaderView(props) {
    const { pathname } = useLocation();

    function loginHandlerACB() { props.onLogin(); }
    function logoutHandlerACB() { props.onLogout(); }
    function toggleMenuACB() { props.onToggleMenu(); }
    function menuItemClickACB() { props.onMenuItemClick(); }

    function linkClass(path) {
        return pathname === path ? "underline" : "hover:underline";
    }

    function renderDesktop() {
        return (
            <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="no-underline">
                    <h1 className="font-black text-4xl tracking-tighter text-nowrap">
                        URBAN EXPLORE
                    </h1>
                </Link>

                <nav className="flex text-xl gap-3 font-semibold">
                    <Link to="/search" className={linkClass("/search")}>Search</Link>
                    <Link to="/favorites" className={linkClass("/favorites")}>Favorites</Link>
                </nav>

                <div className="flex-1" />
                <span className="text-sm text-right">
                    {props.user ? `Logged in as ${props.user.name}` : ""}
                </span>
                <Button onClick={props.user ? logoutHandlerACB : loginHandlerACB}>
                    {props.user ? "Log out" : "Login with Google"}
                </Button>
            </div>
        );
    }

    function renderMobile() {
        return (
            <div className="md:hidden">
                <div className="flex items-center justify-between">
                    <Link to="/" className="no-underline" onClick={menuItemClickACB}>
                        <h1 className="font-black text-2xl tracking-tighter">
                            URBAN EXPLORE
                        </h1>
                    </Link>
                    <button onClick={toggleMenuACB} className="p-2" aria-label="Toggle menu">
                        {props.isNavigationMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {props.isNavigationMenuOpen && (
                    <div className="mt-6 flex flex-col gap-4">
                        <nav className="flex flex-col gap-4 text-lg font-semibold">
                            <Link to="/search" className={linkClass("/search")} onClick={menuItemClickACB}>
                                Search
                            </Link>
                            <Link to="/favorites" className={linkClass("/favorites")} onClick={menuItemClickACB}>
                                Favorites
                            </Link>
                        </nav>

                        {props.user && (
                            <span className="text-sm text-gray-600">
                                Logged in as {props.user.name}
                            </span>
                        )}

                        <Button
                            onClick={props.user ? logoutHandlerACB : loginHandlerACB}
                            className="w-full"
                        >
                            {props.user ? "Log out" : "Login with Google"}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <header className="global-px pt-8 pb-5">
            {renderDesktop()}
            {renderMobile()}
        </header>
    );
}
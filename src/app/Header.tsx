import { Link } from "react-router-dom";
import { useAppStore } from "./AppStore";

const Header = () => {
    const isAuthenticated = useAppStore((s) => s.isAuthenticated);
    const user = useAppStore((s) => s.user);
    const logout = useAppStore((s) => s.logout);

    return (
        <header className="mixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/95 to-amber-800/95 backdrop-blur-lg border-b-2 border-yellow-600">
            <div className="px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-400 tracking-wider">D&D Journal & Loot Tracker</div>
                <div className="flex gap-4 items-center">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 font-semibold tracking-wide uppercase text-sm"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 font-semibold tracking-wide uppercase text-sm"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-yellow-300 font-semibold text-sm mr-2">{user}</span>
                            <button
                                onClick={logout}
                                className="bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 font-semibold tracking-wide uppercase text-sm"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

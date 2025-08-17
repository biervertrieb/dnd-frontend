import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="fixed top-16 left-0 right-0 z-40">
            <div className="max-w-4xl mx-auto px-8 py-5">
                <nav className="flex justify-center gap-10">
                    <NavLink className="nav-link group relative px-6 py-3 text-yellow-200 hover:text-yellow-400 transition-all duration-300 font-semibold tracking-wider uppercase text-lg bg-amber-800/50 rounded-lg hover:bg-amber-700/50 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1" to="/">Journal</NavLink>
                    <NavLink className="nav-link group relative px-6 py-3 text-yellow-200 hover:text-yellow-400 transition-all duration-300 font-semibold tracking-wider uppercase text-lg bg-amber-800/50 rounded-lg hover:bg-amber-700/50 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1" to="/compendium">Compendium</NavLink>
                    <NavLink className="nav-link group relative px-6 py-3 text-yellow-200 hover:text-yellow-400 transition-all duration-300 font-semibold tracking-wider uppercase text-lg bg-amber-800/50 rounded-lg hover:bg-amber-700/50 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1" to="/loot">Loot</NavLink>
                </nav>
            </div>
        </div>
    );
}

export default Navigation;

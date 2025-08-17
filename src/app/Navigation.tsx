import { NavLink } from "react-router-dom";

const NavButton = ({ text, to }: { text: string, to: string }) => {
    return (
        <NavLink
            to={to}
            className="nav-link group relative px-6 py-3 text-yellow-200 hover:text-yellow-400 transition-all duration-300 font-semibold tracking-wider uppercase text-lg bg-amber-800/50 rounded-lg hover:bg-amber-700/50 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1"
        >
            {text}
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-4/5 transition-all duration-300 transform -translate-x-1/2"></div>
        </NavLink>
    );
}

const Navigation = () => {
    return (
        <div className="fixed top-16 left-0 right-0 z-40">
            <div className="max-w-4xl mx-auto px-8 py-5">
                <nav className="flex justify-center gap-10">
                    <NavButton text="Journal" to="/" />
                    <NavButton text="Compendium" to="/compendium" />
                    <NavButton text="Loot" to="/loot" />
                </nav>
            </div>
        </div>
    );
}

export default Navigation;

import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="mixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/95 to-amber-800/95 backdrop-blur-lg border-b-2 border-yellow-600">
            <div className="px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-400 tracking-wider">D&D Journal & Loot Tracker</div>
                <div className="bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 font-semibold tracking-wide uppercase text-sm">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

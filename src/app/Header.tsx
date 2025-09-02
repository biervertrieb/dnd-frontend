import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="mixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/95 to-amber-800/95 backdrop-blur-lg border-b-2 border-yellow-600">
            <div className="px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-yellow-400 tracking-wider">D&D Journal & Loot Tracker</div>
            </div>
        </header>
    );
};

export default Header;

import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="topbar">
            <div className="brand">D&D Journal & Loot Tracker</div>
            <div className="tabs">
                <Link to="/login">Login</Link>
            </div>
        </header>
    );
};

export default Header;

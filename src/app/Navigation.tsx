import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <nav className="navigation">
            <NavLink to="/">Journal</NavLink>
            <NavLink to="/compendium">Compendium</NavLink>
            <NavLink to="/loot">Loot</NavLink>
        </nav>
    );
}

export default Navigation;

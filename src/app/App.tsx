import { BrowserRouter, Routes, Route, useLocation, type Location } from "react-router-dom";
import Layout from "./Layout";
import JournalPage from "../features/journal/JournalPage";
import CompendiumPage from "../features/compendium/CompendiumPage";
import CompendiumModal from "../features/modals/CompendiumModal";
import "./app.css";

type BackgroundState = { backgroundLocation?: Location }

const AppContent = () => {
    const location = useLocation();
    const state = (location.state as BackgroundState) || {};

    const modalRoutePatterns = ['/compendium/'];
    const isModalRoute = modalRoutePatterns.some(pattern => location.pathname.includes(pattern));

    const backgroundLocation =
        state.backgroundLocation ??
        (isModalRoute
            ? {
                ...location,
                pathname: "/compendium",
                search: "",
                hash: "",
                state: null,
                key: "synthetic-bg",
            }
            : undefined);

    return (
        <>
            <Layout>
                <Routes location={backgroundLocation || location}>
                    <Route path="/" element={<JournalPage />} />
                    <Route path="/compendium" element={<CompendiumPage />} />
                    <Route path="/loot" element={<div>Loot coming soon...</div>} />
                </Routes>
            </Layout >
            {isModalRoute && (
                <Routes>
                    <Route path="/compendium/:id" element={<CompendiumModal />} />
                </Routes>
            )
            }
        </>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;

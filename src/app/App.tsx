import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import JournalPage from "../features/journal/JournalPage";
import CompendiumPage from "../features/compendium/CompendiumPage";
import "./app.css";
import CompendiumModal from "../features/modals/CompendiumModal";

const AppContent = () => {



    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<JournalPage />} />
                    <Route path="/compendium" element={<CompendiumPage />} />
                    <Route path="/loot" element={<div>Loot coming soon...</div>} />
                </Routes>
            </Layout >
        </>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
            <CompendiumModal />
        </BrowserRouter>
    );
}

export default App;

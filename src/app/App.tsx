import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import JournalPage from "../features/journal/JournalPage";
import "./app.css";

const AppContent = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<JournalPage />} />
                <Route path="/compendium" />
                <Route path="/loot" />
            </Routes>
        </Layout>
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

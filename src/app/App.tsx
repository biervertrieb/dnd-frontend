import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import JournalPage from "../features/journal/JournalPage";
import CompendiumPage from "../features/compendium/CompendiumPage";
import "./app.css";
import CompendiumModal from "../features/modals/CompendiumModal";
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import { useAppStore } from "./AppStore";

const AppContent = () => {
    const isAuthenticated = useAppStore((s) => s.isAuthenticated);
    const authenticate = useAppStore((s) => s.authenticate);

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <Layout nonav={!isAuthenticated}>
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/"
                    element={isAuthenticated ? <JournalPage /> : <LoginPage />}
                />
                <Route
                    path="/compendium"
                    element={isAuthenticated ? <CompendiumPage /> : <LoginPage />}
                />
                <Route
                    path="/loot"
                    element={isAuthenticated ? <div>Loot coming soon...</div> : <LoginPage />}
                />
            </Routes>
        </Layout>
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

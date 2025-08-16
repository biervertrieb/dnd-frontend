import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

const AppContent = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/journal" />
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

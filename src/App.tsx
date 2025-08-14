// src/App.tsx
import { useEffect, useState } from "react";
import "./app.css";
import JournalTimeline from "./features/journal/JournalTimeline";
import CompendiumOverview from "./features/compendium/CompendiumOverview";
import CompendiumModal from "./features/compendium/CompendiumModal";
// import Loot from "./features/loot/Loot"; // later

type Tab = "journal" | "compendium" | "loot";

export default function App() {
    const [tab, setTab] = useState<Tab>(() => {
        // try hash first, then localStorage, else default
        const fromHash = location.hash.replace("#", "") as Tab;
        if (fromHash === "journal" || fromHash === "compendium" || fromHash === "loot") return fromHash;
        const saved = localStorage.getItem("tab") as Tab | null;
        return saved ?? "journal";
    });

    //Compendium modal state
    const [openCompendiumId, setOpenCompendiumId] = useState<string | null>(null);
    const openCompendium = (id: string) => setOpenCompendiumId(id);
    const closeCompendium = () => setOpenCompendiumId(null);

    // keep hash + localStorage in sync so reloads stay on the same tab
    useEffect(() => {
        location.hash = tab;
        localStorage.setItem("tab", tab);
    }, [tab]);

    return (
        <div className="shell">
            <header className="topbar">
                <div className="brand">D&D Journal & Loot Tracker</div>
                <nav className="tabs">
                    <button className={tab === "journal" ? "active" : ""} onClick={() => setTab("journal")}>Journal</button>
                    <button className={tab === "compendium" ? "active" : ""} onClick={() => setTab("compendium")}>Compendium</button>
                    <button className={tab === "loot" ? "active" : ""} onClick={() => setTab("loot")}>Loot</button>
                </nav>
            </header>

            <main className="content">
                {tab === "journal" && <JournalTimeline onOpenCompendium={openCompendium} />}
                {tab === "compendium" && <CompendiumOverview onOpenCompendium={openCompendium} />}
                {tab === "loot" && <div>Loot coming soon…</div>}
            </main>
            {openCompendiumId && (
                <CompendiumModal id={openCompendiumId} onClose={closeCompendium} />
            )}
        </div>
    );
}


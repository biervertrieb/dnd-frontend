import { useEffect, useState } from "react";
import ReactMarkdown from "@uiw/react-markdown-preview";
import NewEntryForm from "./NewJournalEntryForm";

interface JournalEntry {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

const API = import.meta.env.VITE_API_URL;

export default function JournalList() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await fetch(`${API}/journal`);
            const data = await res.json();
            setEntries(data);
            setLoading(false);
        })();
    }, []);

    function handleCreated(entry: JournalEntry) {
        setEntries((prev) => [entry, ...prev]);
        setShowNew(false);
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="journal-list" style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Journal Entries</h2>
                {!showNew ? (
                    <button onClick={() => setShowNew(true)}>New Entry</button>
                ) : null}
            </div>

            {showNew && (
                <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                    <NewEntryForm onCreated={handleCreated} onCancel={() => setShowNew(false)} />
                </div>
            )}

            <ul style={{ display: "grid", gap: 16, padding: 0 }}>
                {entries.map((e) => (
                    <li key={e.id} style={{ listStyle: "none", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                        <h3 style={{ margin: 0 }}>{e.title}</h3>
                        <small>{new Date(e.created_at).toLocaleString()}</small>
                        <div style={{ paddingTop: 8 }}>
                            <ReactMarkdown source={e.body} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


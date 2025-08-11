import { useEffect, useState } from "react";
import ReactMarkdown from "@uiw/react-markdown-preview";
import JournalEntryForm from "./JournalEntryForm";
import type { JournalEntry } from "./types.ts";


const API = import.meta.env.VITE_API_URL;

export default function JournalList() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

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

    function handleUpdated(entry: JournalEntry) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
        setEditId(null);
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="journal-list" style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Journal Entries</h2>
                {!showNew && (
                    <button onClick={() => setShowNew(true)}>New Entry</button>
                )}
            </div>

            {showNew && (
                <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                    <JournalEntryForm mode="create" onSubmitSuccess={handleCreated} onCancel={() => setShowNew(false)} />
                </div>
            )}

            <ul style={{ display: "grid", gap: 16, padding: 0 }}>
                {entries.map((e) => {
                    const isEditing = editId === e.id;
                    return (
                        <li key={e.id} style={{ listStyle: "none", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                            {isEditing ? (
                                <JournalEntryForm
                                    mode="edit"
                                    initial={e}
                                    onSubmitSuccess={handleUpdated}
                                    onCancel={() => setEditId(null)}
                                />
                            ) : (
                                <div style={{ display: "grid", gap: 6 }}>
                                    <h3 style={{ margin: 0 }}>{e.title}</h3>
                                    <small>
                                        {new Date(e.created_at).toLocaleString()}
                                        {e.updated_at ? ` • edited ${new Date(e.updated_at).toLocaleString()}` : ""}
                                    </small>
                                    <div style={{ paddingTop: 8 }}>
                                        <ReactMarkdown source={e.body} />
                                    </div>
                                    <div style={{ paddingTop: 8 }}>
                                        <button onClick={() => setEditId(e.id)}>Edit</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}


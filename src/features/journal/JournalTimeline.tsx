import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import JournalEntryForm from "./JournalEntryForm";
import type { JournalEntry } from "./types";

import './journal.css'

const API = import.meta.env.VITE_API_URL as string;

// Stable “random” side based on id (so it doesn’t jump between renders)
function sideFor(id: string, mode: "alternate" | "hash" = "alternate", idx = 0): "left" | "right" {
    if (mode === "alternate") return idx % 2 === 0 ? "left" : "right";
    // hash mode
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return (h & 1) === 0 ? "left" : "right";
}

export default function JournalTimeline() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await fetch(`${API}/journal`);
            const data = (await res.json()) as JournalEntry[];
            // newest first (ensure consistent order)
            data.sort((a, b) => parseInt(b.ingame_day) - parseInt(a.ingame_day));
            setEntries(data);
            setFocusedId(data[0]?.id ?? null);
            setLoading(false);
        })();
    }, []);

    const grouped = useMemo(() => {
        // optional: group by day label
        return entries.map((e, i) => ({
            entry: e,
            side: sideFor(e.id, "alternate", i), // change to "alternate" for strict L/R alt
            idx: i,
        }));
    }, [entries]);

    function onCreated(entry: JournalEntry) {
        setEntries((prev) => [entry, ...prev]);
        setFocusedId(entry.id);
        setShowCreate(false);
    }

    function onUpdated(entry: JournalEntry) {
        setEntries((prev) => prev.map((x) => (x.id === entry.id ? entry : x)));
        setFocusedId(entry.id);
        setEditingId(null);
    }

    if (loading) return <div className="tl-wrapper"><div className="tl-loading">Loading timeline…</div></div>;

    return (
        <div className="tl-wrapper">
            <header className="tl-header">
                <h2>D&amp;D Journal Timeline</h2>
                <div className="tl-actions">
                    {!showCreate && (
                        <button className="btn" onClick={() => { setShowCreate(true); setEditingId(null); }}>
                            + New Entry
                        </button>
                    )}
                    {showCreate && (
                        <button className="btn secondary" onClick={() => setShowCreate(false)}>
                            Cancel
                        </button>
                    )}
                </div>
            </header>

            {showCreate && (
                <section className="tl-card tl-card-wide enter">
                    <h3>Create Entry</h3>
                    <JournalEntryForm mode="create" onSubmitSuccess={onCreated} onCancel={() => setShowCreate(false)} />
                </section>
            )}

            <div className="tl-rail">
                <div className="tl-spine" aria-hidden />

                <ol className="tl-list">
                    {grouped.map(({ entry, side, idx }) => {
                        const focused = focusedId === entry.id && !showCreate;
                        const editing = editingId === entry.id && focused;

                        return (
                            <li key={entry.id} className={`tl-item ${side}`}>
                                <div className={`tl-node ${focused ? "active" : ""}`} />

                                <article
                                    className={`tl-card ${focused ? "focused" : ""} enter`}
                                    onClick={() => {
                                        if (!focused) {
                                            setFocusedId(entry.id);
                                            setEditingId(null);
                                            setShowCreate(false);
                                        }
                                    }}
                                >
                                    <header className="tl-card-header">
                                        <div>
                                            <h3 className="tl-title">Day {entry.ingame_day}: {entry.title || "(untitled)"}</h3>
                                        </div>
                                        {focused && !editing && (
                                            <button
                                                className="btn icon quill"
                                                aria-label="Edit entry"
                                                title="Edit entry"
                                                onClick={(e) => { e.stopPropagation(); setEditingId(entry.id); }}
                                            >
                                                {/* SVG Quill icon */}
                                                <img src="/assets/icons/quill.svg" alt="" width={18} height={18} />
                                            </button>
                                        )}
                                    </header>

                                    {!focused ? (
                                        <p className="tl-snippet">{snippet(entry.body)}</p>
                                    ) : editing ? (
                                        <JournalEntryForm
                                            mode="edit"
                                            initial={entry}
                                            onSubmitSuccess={onUpdated}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <div>
                                            <div className="tl-content markdown">
                                                <ReactMarkdown>{entry.body}</ReactMarkdown>
                                            </div>
                                            <footer>
                                                <div>
                                                    <time className="tl-meta">
                                                        {entry.updated_at ? `edited ${new Date(entry.updated_at).toLocaleString()}` : `created ${new Date(entry.created_at).toLocaleString()}`}
                                                    </time>
                                                </div>
                                            </footer>
                                        </div>
                                    )}
                                </article>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
}

function snippet(md: string, max = 160) {
    const plain = md
        .replace(/```[\s\S]*?```/g, "") // fenced code
        .replace(/`[^`]*`/g, "") // inline code
        .replace(/[#>*_\-\[\]\(\)!]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return plain.length > max ? plain.slice(0, max - 1) + "…" : plain || "(no preview)";
}


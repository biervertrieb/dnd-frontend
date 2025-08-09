import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import JournalEntryForm, { type JournalEntry } from "./JournalEntryForm";

const API = import.meta.env.VITE_API_URL as string;

export default function JournalTimeline() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // reader-pane modes
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(false);

    const itemRefs = useRef<HTMLButtonElement[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await fetch(`${API}/journal`);
            const data = (await res.json()) as JournalEntry[];
            data.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
            setEntries(data);
            setSelectedIndex(0);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const el = itemRefs.current[selectedIndex];
        if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, [selectedIndex]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!entries.length || showCreate || editing) return;
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "j") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, entries.length - 1));
            } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "k") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [entries.length, showCreate, editing]);

    const selected = entries[selectedIndex];

    const grouped = useMemo(() => {
        const byMonth = new Map<string, JournalEntry[]>();
        for (const e of entries) {
            const d = new Date(e.created_at);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            if (!byMonth.has(key)) byMonth.set(key, []);
            byMonth.get(key)!.push(e);
        }
        return Array.from(byMonth.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
    }, [entries]);

    function handleCreated(entry: JournalEntry) {
        setEntries((prev) => [entry, ...prev]);
        setSelectedIndex(0);
        setShowCreate(false);
        setEditing(false);
    }

    function handleUpdated(entry: JournalEntry) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
        const idx = entries.findIndex((e) => e.id === entry.id);
        if (idx >= 0) setSelectedIndex(idx);
        setEditing(false);
        setShowCreate(false);
    }

    if (loading) return <div>Loading timeline…</div>;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 420px) 1fr", gap: 16, height: "calc(100vh - 32px)" }}>
            {/* Timeline column */}
            <aside style={{ borderRight: "1px solid #eee", overflow: "auto", paddingRight: 8, paddingLeft: 4 }}>
                <div style={{ padding: "8px 4px" }}>
                    <button
                        onClick={() => { setShowCreate(true); setEditing(false); }}
                    >
                        New Entry
                    </button>
                </div>

                {grouped.map(([month, list]) => (
                    <section key={month} style={{ margin: "12px 0" }}>
                        <div style={{ fontSize: 12, color: "#666", margin: "6px 8px" }}>{prettyMonth(month)}</div>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                            {list.map((e) => {
                                const idx = entries.findIndex((x) => x.id === e.id);
                                const active = idx === selectedIndex && !showCreate;
                                return (
                                    <li key={e.id} style={{ marginBottom: 6 }}>
                                        <button
                                            ref={(el) => { if (el) itemRefs.current[idx] = el; }}
                                            onClick={() => { setSelectedIndex(idx); setEditing(false); setShowCreate(false); }}
                                            title={new Date(e.created_at).toLocaleString()}
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                border: active ? "2px solid #6366f1" : "1px solid #e5e7eb",
                                                background: active ? "#eef2ff" : "#fff",
                                                borderRadius: 8,
                                                padding: "8px 10px",
                                                cursor: "pointer",
                                                display: "grid",
                                                gap: 4
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: active ? "#4f46e5" : "#d1d5db" }} />
                                                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {e.title || "(untitled)"}
                                                </strong>
                                            </div>
                                            <small style={{ color: "#6b7280" }}>{new Date(e.created_at).toLocaleString()}</small>
                                            <div style={{ color: "#374151", fontSize: 13, lineHeight: 1.25 }}>{snippet(e.body)}</div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </aside>

            {/* Reader column */}
            <main style={{ overflow: "auto", paddingRight: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div>
                        <h2 style={{ margin: "8px 0 0 0" }}>
                            {showCreate ? "Create Entry" : editing ? `Edit: ${selected?.title ?? ""}` : selected?.title ?? "(untitled)"}
                        </h2>
                        {!showCreate && selected && (
                            <div style={{ color: "#6b7280", fontSize: 13 }}>
                                {new Date(selected.created_at).toLocaleString()}
                                {selected.updated_at ? ` • edited ${new Date(selected.updated_at).toLocaleString()}` : ""}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {!showCreate && selected && (
                            <>
                                <button onClick={() => setSelectedIndex((i) => Math.max(i - 1, 0))} disabled={selectedIndex === 0}>
                                    ← Prev
                                </button>
                                <button onClick={() => setSelectedIndex((i) => Math.min(i + 1, entries.length - 1))} disabled={selectedIndex === entries.length - 1}>
                                    Next →
                                </button>
                                <button onClick={() => { setEditing(true); setShowCreate(false); }}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 12 }}>
                    {showCreate ? (
                        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
                            <JournalEntryForm
                                mode="create"
                                onSubmitSuccess={handleCreated}
                                onCancel={() => setShowCreate(false)}
                            />
                        </div>
                    ) : editing && selected ? (
                        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
                            <JournalEntryForm
                                mode="edit"
                                initial={selected}
                                onSubmitSuccess={handleUpdated}
                                onCancel={() => setEditing(false)}
                            />
                        </div>
                    ) : selected ? (
                        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
                            <ReactMarkdown>{selected.body}</ReactMarkdown>
                        </div>
                    ) : (
                        <div style={{ padding: 16 }}>No entries yet. Click “New Entry”.</div>
                    )}
                </div>
            </main>
        </div>
    );
}

function snippet(md: string, max = 140) {
    const plain = md
        .replace(/`{1,3}.*?`{1,3}/gs, "")
        .replace(/[#>*_\-\[\]\(\)!]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return plain.length > max ? plain.slice(0, max - 1) + "…" : plain;
}

function prettyMonth(key: string) {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
}


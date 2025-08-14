import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"
import "./modal.css";
import type { CompendiumEntry } from "./types";

const API = import.meta.env.VITE_API_URL as string;

export default function CompendiumModal({ id, onClose, }: { id: string; onClose: () => void }) {
    const [entry, setEntry] = useState<CompendiumEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const res = await fetch(`${API}/compendium/${id}`);
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const data = (await res.json()) as CompendiumEntry;
                if (alive) setEntry(data);
            } catch (e: any) {
                if (alive) setErr(e.message || "Failed to load");
            } finally {
                if (alive) setLoading(false);
            }
        })();
    }, [id]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <header>
                    <h3>{entry?.title ?? "Compendium Entry"}</h3>
                    <button className="close" onClick={onClose}>Close</button>
                </header>
                <div className="body">
                    {loading && <div>Loading...</div>}
                    {err && <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{err}</div>}
                    {entry && !loading && !err && (
                        <>
                            <div className="markdown">
                                <ReactMarkdown>{entry.body}</ReactMarkdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

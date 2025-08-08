// src/NewEntryForm.tsx
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface JournalEntry {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

interface Props {
    onCreated(entry: JournalEntry): void;
    onCancel?(): void;
}

const API = import.meta.env.VITE_API_URL;

export default function NewEntryForm({ onCreated, onCancel }: Props) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState<string>("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API}/journal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body }),
            });
            if (!res.ok) throw new Error(`Create failed: ${res.status}`);
            // backend might return { entry: {...} } or the entry directly; handle both
            const json = await res.json();
            const entry: JournalEntry = json.entry ?? json;
            onCreated(entry);
            setTitle("");
            setBody("");
        } catch (err) {
            console.error(err);
            alert("Failed to create entry.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="new-entry" data-color-mode="light" style={{ display: "grid", gap: 8 }}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ fontSize: 16, padding: 8 }}
            />
            <MDEditor value={body} onChange={(v) => setBody(v ?? "")} height={260} />
            <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={saving}>{saving ? "Saving…" : "Create"}</button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
                )}
            </div>
        </form>
    );
}


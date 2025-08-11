// src/NewEntryForm.tsx
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import type { JournalEntry } from "./types";

type Mode = "create" | "edit";

interface Props {
    mode: Mode;
    initial?: Partial<JournalEntry> & { id?: string };
    onSubmitSuccess(entry: JournalEntry): void;
    onCancel?(): void;
}

const API = import.meta.env.VITE_API_URL;

export default function JournalEntryForm({ mode, initial, onSubmitSuccess, onCancel }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [body, setBody] = useState<string>(initial?.body ?? "");
    const [day, setDay] = useState<string>(initial?.ingame_day ?? "");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setTitle(initial?.title ?? "");
        setBody(initial?.body ?? "");
        setDay(initial?.ingame_day ?? "");
    }, [initial?.title, initial?.body, initial?.ingame_day]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        if (isNaN(parseInt(day))) {
            alert("Day must be a valid number");
            return;
        }

        setSaving(true);
        try {
            let res: Response;
            if (mode === "create") {
                res = await fetch(`${API}/journal`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body, day }),
                });
            } else {
                if (!initial?.id) return alert("Missing entry id for edit");
                res = await fetch(`${API}/journal/${initial.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body, day }),
                });
            }
            if (!res.ok) throw new Error(`${mode} failed: ${res.status}`);
            // backend might return { entry: {...} } or the entry directly; handle both
            const json = await res.json();
            const entry: JournalEntry = json.entry ?? json;
            onSubmitSuccess(entry);
            if (mode === "create") {
                setTitle("");
                setBody("");
                setDay("");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save entry.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="new-entry" data-color-mode="light" style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <input className="entry-day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="Day"
                    style={{ fontSize: 16, padding: 8, width: "4ch" }}
                />
                <input className="entry-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    style={{ fontSize: 16, padding: 8, width: "100%" }}
                />
            </div>
            <MDEditor value={body} onChange={(v) => setBody(v ?? "")} height={260} />
            <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" type="submit" disabled={saving}>{saving ? "Saving…" : mode === "create" ? "Create" : "Save"}</button>
                {onCancel && (
                    <button className="btn secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
                )}
            </div>
        </form>
    );
}


import type { JournalEntry } from "../types"; "../types";
import { useState, useEffect } from "react";

type Mode = "create" | "edit";

interface Props {
    mode: Mode;
    initial?: Partial<JournalEntry> & { id?: string };
    onSubmitSuccess(entry: JournalEntry): void;
    onCancel?(): void;
    onDelete?(id: string): void;
}

const JournalEntryForm = ({ mode, initial, onSubmitSuccess, onCancel, onDelete }: Props) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [body, setBody] = useState<string>(initial?.body ?? "");
    const [day, setDay] = useState<string>(initial?.day ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setTitle(initial?.title ?? "");
        setBody(initial?.body ?? "");
        setDay(initial?.day ?? "");
    }, [initial?.title, initial?.body, initial?.day]);

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
            /*
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
            }*/
            throw new Error("not implemented"); //TODO: implement!
        } catch (err) {
            console.error(err);
            alert("Failed to save entry.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!initial?.id) return;
        if (!confirm("Delete this journal entry?")) return;

        setDeleting(true);
        try {
            /*
            const res = await fetch(`${API}/journal/${initial.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error(`Delete failed: ${res.status}`);
            onDelete?.(initial.id);
            */
            throw new Error("not implemented"); //TODO: implement!
        } catch (e) {
            console.error(e);
            alert("Failed to delete entry.");
        } finally {
            setDeleting(false);
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
            <textarea>{body}</textarea>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" type="submit" disabled={saving}>{saving ? "Saving…" : mode === "create" ? "Create" : "Save"}</button>
                    {onCancel && (
                        <button className="btn secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
                    )}
                </div>
                {mode === "edit" && initial?.id && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving || deleting}
                        style={{ background: "#f6d7d7", border: "1px solid #c79292", color: "#7b2a2a" }}
                        title="Delete Entry"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                )}
            </div>
        </form>
    );
}

export default JournalEntryForm;

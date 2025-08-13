import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import type { CompendiumEntry } from "./types";

type Mode = "create" | "edit";

interface Props {
    mode: Mode;
    initial?: Partial<CompendiumEntry> & { id?: string };
    onSubmitSuccess(entry: CompendiumEntry): void;
    onCancel?(): void;
    onDelete?(id: string): void;
}

const API = import.meta.env.VITE_API_URL;

export default function CompendiumEntryForm({ mode, initial, onSubmitSuccess, onCancel, onDelete }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [body, setBody] = useState<string>(initial?.body ?? "");
    const [tags, setTags] = useState<string>(initial?.tags ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setTitle(initial?.title ?? "");
        setBody(initial?.body ?? "");
        setTags(initial?.tags ?? "");
    }, [initial?.title, initial?.body, initial?.tags]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        setSaving(true);
        try {
            let res: Response;
            if (mode === "create") {
                res = await fetch(`${API}/compendium`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body, tags }),
                });
            } else {
                if (!initial?.id) return alert("Missing entry id for edit");
                res = await fetch(`${API}/compendium/${initial.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body, tags }),
                });
            }
            if (!res.ok) throw new Error(`${mode} failed: ${res.status}`);
            // backend might return { entry: {...} } or the entry directly; handle both
            const json = await res.json();
            const entry: CompendiumEntry = json.entry ?? json;
            onSubmitSuccess(entry);
            if (mode === "create") {
                setTitle("");
                setBody("");
                setTags("");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save entry.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!initial?.id) return;
        if (!confirm("Delete this compendium entry?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`${API}/compendium/${initial.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error(`Delete failed: ${res.status}`);
            onDelete?.(initial.id);
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
                <input className="entry-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    style={{ fontSize: 16, padding: 8, width: "100%" }}
                />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <input className="entry-tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags"
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
        </form>
    );
}


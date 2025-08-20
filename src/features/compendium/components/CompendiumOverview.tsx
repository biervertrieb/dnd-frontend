import { useState, useEffect } from "react";
import type { CompendiumEntry } from "../types";
import CompendiumEntryCard from "./CompendiumEntryCard";
import { getCompendiumEntries, deleteCompendiumEntry, updateCompendiumEntry } from "../api";
import { useCompendiumStore } from "../CompendiumStore";

const CompendiumOverview = () => {
    const entries = useCompendiumStore((s) => s.entries);
    const setEntries = useCompendiumStore((s) => s.setEntries);
    const loading = useCompendiumStore((s) => s.loading);
    const setLoading = useCompendiumStore((s) => s.setLoading);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getCompendiumEntries();
            data.sort((a, b) => parseInt(b.title.toLowerCase()) - parseInt(a.title.toLowerCase()));
            setEntries(data);
            setFocusedId(data[0]?.id ?? null);
            setLoading(false);
        })();
    }, []);

    const handleClick = (id: string) => {
        !editing && setFocusedId(id);
    }

    const cancelEdit = (id: string) => {
        setFocusedId(id);
        setEditing(false);
    }

    const startEdit = (id: string) => {
        setFocusedId(id);
        setEditing(true);
    }

    const saveEdit = async (id: string, title: string, tags: string, body: string) => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        setSaving(true);
        setFocusedId(id);
        try {
            await updateCompendiumEntry(id, title, tags, body)
            setEditing(false);
            const updatedEntries = entries.map(entry => entry.id === id ? { ...entry, title: title, tags: tags, body: body } : entry);
            setEntries(updatedEntries);
        }
        catch (e) {
            console.error(e);
            alert("Failed to update entry.");
        } finally {
            setSaving(false);
        }
    }

    const deleteEntry = async (id: string) => {
        if (!confirm("Delete this compendium entry?")) return;
        setDeleting(true);
        setFocusedId(id);
        try {
            await deleteCompendiumEntry(id);
            const updatedEntries = entries.filter((e) => e.id !== id);
            setEntries(updatedEntries);
            setEditing(false);
            setFocusedId(null);
        } catch (e) {
            console.error(e);
            alert("Failed to delete entry.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="relative px-8">
            {loading && (
                <div className="text-yellow-400 text-lg pt-10">Loading compendium...</div>
            )}

            {!loading && entries.map((entry, index) => (
                < div className={`relative mb-10 ${index % 2 === 0 ? 'mr-1/2 pr-10' : 'ml-1/2 pl-10'}`}>
                    <CompendiumEntryCard
                        key={entry.id}
                        mode="edit"
                        entry={entry}
                        isExpanded={focusedId === entry.id}
                        isDeleting={(focusedId === entry.id) && deleting}
                        isSaving={(focusedId === entry.id) && saving}
                        isEditing={(focusedId === entry.id) && editing}
                        onClick={() => handleClick(entry.id)}
                        onCancel={() => cancelEdit(entry.id)}
                        onStartEdit={() => startEdit(entry.id)}
                        onSave={(title, tags, body) => saveEdit(entry.id, title, tags, body)}
                        onDelete={() => deleteEntry(entry.id)}
                    />
                </div>
            ))
            }
        </div >
    );
}

export default CompendiumOverview;

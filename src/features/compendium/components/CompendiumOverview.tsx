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
    const focusedId = useCompendiumStore((s) => s.focusedId);
    const setFocusedId = useCompendiumStore((s) => s.setFocusedId);
    const editing = useCompendiumStore((s) => s.editing);
    const deleting = useCompendiumStore((s) => s.deleting);
    const saving = useCompendiumStore((s) => s.saving);
    const setEditing = useCompendiumStore((s) => s.setEditing);
    const setDeleting = useCompendiumStore((s) => s.setDeleting);
    const setSaving = useCompendiumStore((s) => s.setSaving);

    const updateEntry = useCompendiumStore((s) => s.updateEntry);
    const deleteEntry = useCompendiumStore((s) => s.deleteEntry);

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
                        onSave={(title, tags, body) => updateEntry(entry.id, title, tags, body)}
                        onDelete={() => deleteEntry(entry.id)}
                    />
                </div>
            ))
            }
        </div >
    );
}

export default CompendiumOverview;

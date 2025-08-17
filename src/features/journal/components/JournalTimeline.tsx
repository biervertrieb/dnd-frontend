import { useState, useEffect } from "react";
import type { JournalEntry } from "../types";
import JournalEntryCard from "./JournalEntryCard";
import { getJournalEntries, deleteJournalEntry, updateJournalEntry } from "../api";


const TimelineSpine = () => {
    return (
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg shadow-yellow-500/50"></div>
    );
}

type Props = {
    reloadKey: number
}

const JournalTimeline = ({ reloadKey }: Props) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getJournalEntries();
            data.sort((a, b) => parseInt(b.day) - parseInt(a.day));
            setEntries(data);
            setFocusedId(data[0]?.id ?? null);
            setLoading(false);
        })();
    }, [reloadKey]);

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

    const saveEdit = async (id: string, title: string, day: string, body: string) => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        if (isNaN(parseInt(day))) {
            alert("Day must be a valid number");
            return;
        }
        setSaving(true);
        setFocusedId(id);
        try {
            await updateJournalEntry(id, title, day, body)
            setEditing(false);
            setEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, title: title, day: day, body: body } : entry
            ));
        }
        catch (e) {
            console.error(e);
            alert("Failed to update entry.");
        } finally {
            setSaving(false);
        }
    }

    const deleteEntry = async (id: string) => {
        if (!confirm("Delete this journal entry?")) return;
        setDeleting(true);
        setFocusedId(id);
        try {
            await deleteJournalEntry(id);
            setEntries((prev) => prev.filter((e) => e.id !== id))
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
            {
                loading ? (
                    <div className="text-yellow-400 text-lg pt-10">Loading timeline...</div>
                ) :

                    (<TimelineSpine />)}

            {!loading && entries.map((entry, index) => (
                < div className={`relative mb-10 ${index % 2 === 0 ? 'mr-1/2 pr-10' : 'ml-1/2 pl-10'}`}>
                    <div className={`absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-amber-800 rounded-full top-8 shadow-lg shadow-yellow-500/60 ${index % 2 === 0 ? '-right-12' : '-left-12'}`}></div>
                    <JournalEntryCard
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
                        onSave={(title, day, body) => saveEdit(entry.id, title, day, body)}
                        onDelete={() => deleteEntry(entry.id)}
                    />
                </div>
            ))
            }
        </div >
    );
}

export default JournalTimeline;

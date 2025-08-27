import { useEffect } from "react";
import JournalEntryCard from "./JournalEntryCard";
import { useJournalStore } from "../JournalStore";


const TimelineSpine = () => {
    return (
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg shadow-yellow-500/50"></div>
    );
}

const JournalTimeline = () => {
    const saving = useJournalStore((s) => s.saving);
    const entries = useJournalStore((s) => s.entries);
    const loading = useJournalStore((s) => s.loading);
    const focusedId = useJournalStore((s) => s.focusedId);
    const editing = useJournalStore((s) => s.editing);
    const deleting = useJournalStore((s) => s.deleting);

    const setFocusedId = useJournalStore((s) => s.setFocusedId);
    const setEditing = useJournalStore((s) => s.setEditing);

    const loadEntries = useJournalStore((s) => s.loadEntries);

    useEffect(() => {
        loadEntries();
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

    const saveEdit = useJournalStore((s) => s.updateEntry);

    const deleteEntry = useJournalStore((s) => s.deleteEntry);

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

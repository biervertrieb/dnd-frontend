import { useEffect } from "react";
import CompendiumEntryCard from "./CompendiumEntryCard";
import { useCompendiumStore } from "../CompendiumStore";

const CompendiumOverview = () => {
    const entries = useCompendiumStore((s) => s.entries);
    const loading = useCompendiumStore((s) => s.loading);
    const focusedId = useCompendiumStore((s) => s.focusedId);
    const setFocusedId = useCompendiumStore((s) => s.setFocusedId);
    const editing = useCompendiumStore((s) => s.editing);
    const deleting = useCompendiumStore((s) => s.deleting);
    const saving = useCompendiumStore((s) => s.saving);
    const setEditing = useCompendiumStore((s) => s.setEditing);

    const updateEntry = useCompendiumStore((s) => s.updateEntry);
    const deleteEntry = useCompendiumStore((s) => s.deleteEntry);
    const loadEntries = useCompendiumStore((s) => s.loadEntries);

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

    return (
        <div className="relative px-8">
            {loading && (
                <div className="text-yellow-400 text-lg pt-10">Loading compendium...</div>
            )}

            {!loading && (() => {
                // Group entries by starting character
                const groups: { [key: string]: typeof entries } = {};
                entries.forEach(entry => {
                    const char = entry.title.trim().charAt(0).toUpperCase();
                    const groupKey = /[A-Z]/.test(char) ? char : '#';
                    if (!groups[groupKey]) groups[groupKey] = [];
                    groups[groupKey].push(entry);
                });
                const sortedKeys = Object.keys(groups).sort();
                return (
                    <div className="flex flex-col gap-10">
                        {sortedKeys.map(groupKey => (
                            <div key={groupKey} className="mb-8">
                                <div className="flex items-center mb-4">
                                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                      <span className="text-2xl font-bold text-yellow-100" style={{fontFamily: 'serif'}}>
                                         {groupKey === '#' ? 'Other' : groupKey}
                                        </span>
                                  </div>
                                  <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-600 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-20">
                                    {groups[groupKey].map(entry => (
                                        <div className="relative mb-0" key={entry.id}>
                                            <CompendiumEntryCard
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
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}
        </div>
    );
}

export default CompendiumOverview;

import { useEffect, useRef } from "react";
import CompendiumEntryCard from "./CompendiumEntryCard";
import { useCompendiumStore } from "../CompendiumStore";

import { useState } from "react";

type CompendiumSearchBarProps = {
    onSearch: (term: string, tags: string[]) => void;
    allTags: string[];
};

const CompendiumSearchBar: React.FC<CompendiumSearchBarProps> = ({ onSearch, allTags }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update suggestions when typing
    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const filtered = allTags.filter(tag =>
            tag.toLowerCase().includes(term) && !searchTags.includes(tag)
        ).slice(0, 8);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [searchTerm, allTags, searchTags]);

    // Notify parent on changes
    useEffect(() => {
        onSearch(searchTerm, searchTags);
    }, [searchTerm, searchTags, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTagSuggestionClick = (tag: string) => {
        setSearchTags([...searchTags, tag]);
        setSearchTerm("");
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleTagRemove = (tag: string) => {
        setSearchTags(searchTags.filter(t => t !== tag));
        inputRef.current?.focus();
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            // If matches a tag, add as tag
            const match = allTags.find(tag => tag.toLowerCase() === searchTerm.trim().toLowerCase());
            if (match && !searchTags.includes(match)) {
                setSearchTags([...searchTags, match]);
                setSearchTerm("");
                setShowSuggestions(false);
                e.preventDefault();
            }
        }
        // Remove last tag with Backspace if input is empty
        if (e.key === "Backspace" && !searchTerm && searchTags.length > 0) {
            setSearchTags(searchTags.slice(0, -1));
        }
    };

    return (
        <div className="mb-8 flex flex-col gap-2 relative">
            <div
                className="flex flex-wrap items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-700 focus-within:border-yellow-500 bg-amber-50 text-amber-900 text-lg"
                onClick={() => inputRef.current?.focus()}
            >
                {searchTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-amber-200/60 px-2 py-1 rounded text-xs">
                        #{tag}
                        <button
                            type="button"
                            className="text-red-600 text-xs ml-1"
                            onClick={() => handleTagRemove(tag)}
                            tabIndex={-1}
                        >✕</button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={searchTags.length === 0 ? "Search compendium..." : ""}
                    className="flex-1 bg-transparent outline-none text-amber-900 text-lg min-w-[120px]"
                    autoComplete="off"
                />
            </div>
            {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-amber-50 border-2 border-amber-700 rounded-lg shadow-lg z-10 mt-1">
                    {suggestions.map(tag => (
                        <div
                            key={tag}
                            className="px-4 py-2 cursor-pointer hover:bg-amber-100 text-amber-900 text-sm"
                            onClick={() => handleTagSuggestionClick(tag)}
                        >
                            #{tag}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


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

    // Gather all unique tags from entries
    const allTags = Array.from(new Set(entries.flatMap(e => e.tags))).sort();

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTags, setSearchTags] = useState<string[]>([]);

    // Filter entries by title, body, or tags, and by selected tags
    const filteredEntries = entries.filter(entry => {
        const term = searchTerm.trim().toLowerCase();
        // If tags are selected, entry must have all of them
        if (searchTags.length > 0 && !searchTags.every(tag => entry.tags.includes(tag))) {
            return false;
        }
        if (!term) return true;
        return (
            entry.title.toLowerCase().includes(term) ||
            entry.body.toLowerCase().includes(term) ||
            entry.tags.some(tag => tag.toLowerCase().includes(term))
        );
    });

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

    // Handle search bar changes
    const handleSearch = (term: string, tags: string[]) => {
        setSearchTerm(term);
        setSearchTags(tags);
    };

    return (
        <div className="relative px-8">
            <CompendiumSearchBar onSearch={handleSearch} allTags={allTags} />
            {loading && (
                <div className="text-yellow-400 text-lg pt-10">Loading compendium...</div>
            )}

            {!loading && (() => {
                // Group filtered entries by starting character
                const groups: { [key: string]: typeof filteredEntries } = {};
                filteredEntries.forEach(entry => {
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
                                        <span className="text-2xl font-bold text-yellow-100" style={{ fontFamily: 'serif' }}>
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

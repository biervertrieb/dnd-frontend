import { create } from "zustand";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";

type CompendiumState = {
    entries: CompendiumEntry[],
    showNewEntry: boolean,
    savingNew: boolean,
    loading: boolean,
    editing: boolean,
    deleting: boolean,
    saving: boolean,
    focusedId: string | null,
}

type CompendiumActions = {
    setShowNewEntry: (showState: boolean) => void,
    setSavingNew: (savingNewState: boolean) => void,
    setLoading: (loading: boolean) => void,
    setEditing: (editing: boolean) => void,
    setDeleting: (deleting: boolean) => void,
    setSaving: (saving: boolean) => void,
    setFocusedId: (focusedId: string | null) => void,
    setEntries: (entries: CompendiumEntry[]) => void,
    createEntry: (title: string, tags: string, body: string) => Promise<void>,
}

const sortEntries = (entries: CompendiumEntry[]) => {
    return [...entries].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

export const useCompendiumStore = create<CompendiumState & CompendiumActions>()(
    (set, get) => ({
        entries: [],
        showNewEntry: false,
        savingNew: false,
        loading: false,
        editing: false,
        deleting: false,
        saving: false,
        focusedId: null,
        setShowNewEntry: (showState) => set(() => ({ showNewEntry: showState })),
        setSavingNew: (savingNewState) => set(() => ({ savingNew: savingNewState })),
        setLoading: (loading) => set(() => ({ loading: loading })),
        setEditing: (editing) => set(() => ({ editing: editing })),
        setDeleting: (deleting) => set(() => ({ deleting: deleting })),
        setSaving: (saving) => set(() => ({ saving: saving })),
        setFocusedId: (focusedId) => set(() => ({ focusedId: focusedId })),
        setEntries: (entries) => set(() => ({ entries: entries })),
        createEntry: async (title, tags, body) => {
            if (!title.trim()) {
                alert("Title is required!");
                return;
            }
            set({ savingNew: true });
            try {
                const newEntry = await createCompendiumEntry(title, tags, body);
                set({ showNewEntry: false });
                const prev = get().entries;
                set({ entries: sortEntries([newEntry, ...prev]) });

            } catch (e) {
                console.error(e);
                alert("Failed to create entry!");
            } finally {
                set({ savingNew: false })
            }
        },
    })
)

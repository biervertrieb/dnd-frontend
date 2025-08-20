import { create } from "zustand";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";

type CompendiumState = {
    entries: CompendiumEntry[],
    showNewEntry: boolean,
    savingNew: boolean,
    loading: boolean,
}

type CompendiumActions = {
    setShowNewEntry: (showState: boolean) => void,
    setSavingNew: (savingNewState: boolean) => void,
    setLoading: (loading: boolean) => void,
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
        setShowNewEntry: (showState) => set(() => ({ showNewEntry: showState })),
        setSavingNew: (savingNewState) => set(() => ({ savingNew: savingNewState })),
        setLoading: (loading) => set(() => ({ loading: loading })),
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

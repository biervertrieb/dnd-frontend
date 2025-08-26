import { create } from "zustand";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";

type CompendiumState = {
    entries: CompendiumEntry[],
    hasLoaded: boolean,
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
    updateEntry: (id: string, title: string, tags: string, body: string) => Promise<void>,
    deleteEntry: (id: string) => Promise<void>,
    loadEntries: () => Promise<void>;
}

const sortEntries = (entries: CompendiumEntry[]) => {
    return [...entries].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

export const useCompendiumStore = create<CompendiumState & CompendiumActions>()(
    (set, get) => ({
        entries: [],
        hasLoaded: false,
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
                set({ focusedId: newEntry.id });

            } catch (e) {
                console.error(e);
                alert("Failed to create entry!");
            } finally {
                set({ savingNew: false })
            }
        },
        updateEntry: async (id, title, tags, body) => {
            if (!title.trim()) {
                alert("Title is required!");
                return;
            }
            set({ focusedId: id })
            set({ saving: true });
            try {
                const updatedEntry = await updateCompendiumEntry(id, title, tags, body);
                set({ editing: false });
                const prev = get().entries;
                const updatedEntries = prev.map(entry => entry.id === id ? { ...entry, title: title, tags: tags, body: body } : entry);
                set({ entries: sortEntries(updatedEntries) });
            } catch (e) {
                console.error(e);
                alert("Failed to update entry!");
            } finally {
                set({ saving: false })
            }
        },
        deleteEntry: async (id) => {
            if (!confirm("Delete this compendium entry?")) return;
            set({ focusedId: id })
            set({ deleting: true });
            try {
                await deleteCompendiumEntry(id);
                set({ editing: false });
                set({ focusedId: null })
                const prev = get().entries;
                const updatedEntries = prev.filter((e) => e.id !== id);
                set({ entries: sortEntries(updatedEntries) });
            } catch (e) {
                console.error(e);
                alert("Failed to delete entry!");
            } finally {
                set({ deleting: false })
            }
        },
        loadEntries: async () => {
            const alreadyLoaded = get().hasLoaded;
            if (alreadyLoaded)
                return;
            set({ loading: true });
            try {
                const data = await getCompendiumEntries();
                set({ entries: sortEntries(data) });
                set({ hasLoaded: true });
            } catch (e) {
                console.error(e);
                alert("Failed to load entries!");
            } finally {
                set({ loading: false });
            }
        }
    })
)

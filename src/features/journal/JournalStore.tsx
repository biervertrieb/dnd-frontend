import { create } from "zustand";
import type { JournalEntry } from "./types.ts";
import { createJournalEntry, deleteJournalEntry, getJournalEntries, updateJournalEntry } from "./api.ts";

type JournalState = {
    entries: JournalEntry[],
    hasLoaded: boolean,
    showNewEntry: boolean,
    savingNew: boolean,
    loading: boolean,
    editing: boolean,
    deleting: boolean,
    saving: boolean,
    focusedId: string | null,
}

type JournalActions = {
    setShowNewEntry: (showState: boolean) => void,
    setSavingNew: (savingNewState: boolean) => void,
    setLoading: (loading: boolean) => void,
    setEditing: (editing: boolean) => void,
    setDeleting: (deleting: boolean) => void,
    setSaving: (saving: boolean) => void,
    setFocusedId: (focusedId: string | null) => void,
    setEntries: (entries: JournalEntry[]) => void,
    createEntry: (title: string, day: string, body: string) => Promise<void>,
    updateEntry: (id: string, title: string, day: string, body: string) => Promise<void>,
    deleteEntry: (id: string) => Promise<void>,
    loadEntries: () => Promise<void>;
}

const sortEntries = (entries: JournalEntry[]) => {
    return [...entries].sort((a, b) => parseInt(b.day) - parseInt(a.day));
}

export const useJournalStore = create<JournalState & JournalActions>()(
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
        createEntry: async (title, day, body) => {
            if (!title.trim()) {
                alert("Title is required!");
                return;
            }
            if (Number.isInteger(Number(day)) === false) {
                alert("Day must be a valid number!" + day);
                return;
            }
            set({ savingNew: true });
            try {
                const newEntry = await createJournalEntry(title, day, body);
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
        updateEntry: async (id, title, day, body) => {
            if (!title.trim()) {
                alert("Title is required!");
                return;
            }
            if (Number.isInteger(Number(day)) === false) {
                alert("Day must be a valid number");
                return;
            }
            set({ focusedId: id })
            set({ saving: true });
            try {
                const updatedEntry = await updateJournalEntry(id, title, day, body);
                set({ editing: false });
                const prev = get().entries;
                const updatedEntries = prev.map(entry => entry.id === id ? { ...entry, title: title, day: day, body: body } : entry);
                set({ entries: sortEntries(updatedEntries) });
            } catch (e) {
                console.error(e);
                alert("Failed to update entry!");
            } finally {
                set({ saving: false })
            }
        },
        deleteEntry: async (id) => {
            if (!confirm("Delete this journal entry?")) return;
            set({ focusedId: id })
            set({ deleting: true });
            try {
                await deleteJournalEntry(id);
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
            const isCurrentlyLoading = get().loading;
            if (alreadyLoaded || isCurrentlyLoading)
                return;
            set({ loading: true });
            try {
                const data = await getJournalEntries();
                set({ entries: sortEntries(data) });
                set({ hasLoaded: true });
            } catch (e) {
                console.error(e);
                alert("Failed to load entries!");
            } finally {
                set({ loading: false })
            }
        }
    })
)

import { create } from "zustand";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";

type State = {
    entries: CompendiumEntry[];
    query: string;
    newTitle: string;
    newTags: string;
    newBody: string;
    loading: boolean;
    saving: boolean;
    creating: boolean;
    editing: boolean;
    deleting: boolean;
    showNewEntry: boolean;
    focusedId: string | null;

    loadEntries: () => Promise<void>;
    createEntry: (title: string, tags: string, body: string) => Promise<void>;
    updateEntry: (e: CompendiumEntry) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
};

export const useComentiumStore = create<State>()(
    (set, get) => ({
        entries: [],
        query: "",
        newTitle: "",
        newTags: "",
        newBody: "",
        loading: false,
        saving: false,
        creating: false,
        editing: false,
        deleting: false,
        showNewEntry: false,
        focusedId: null,
        loadEntries: async () => {
            set({ loading: true });
            try {
                const data = await getCompendiumEntries();
                data.sort((a, b) => parseInt(b.title.toLowerCase()) - parseInt(a.title.toLowerCase()));
                set({ entries: data });
            } catch (e) {
                throw (e);
            } finally {
                set({ loading: false });
            }
        },
        createEntry: async (input) => {
            if (input.title.trim() == "") {
                alert("Title can not be empty");
                return;
            }
            if (input.body.trim() == "") {
                alert("Body can not be empty");
                return;
            }
            set({ creating: true });
            try {
                const newEntry = await createCompendiumEntry(input.title, input.tags, input.body);
                set({ showNewEntry: false })
                set({ newTitle: "" });
                set({ newTags: "" });
                set({ newBody: "" });
                const prev = get().entries;
                set({ entries: [newEntry, ...prev] })
            } catch (e) {
                console.error(e);
                alert("Failed to create entry");
            } finally {
                set({ creating: false });
            }
        },
        updateEntry: async (entry) => {
            set({ focusedId: entry.id })
            set({ saving: true });
            try {
                const updatedEntry = await updateCompendiumEntry(entry.id, entry.title, entry.tags, entry.body);
                set({ editing: false })
                const prev = get().entries;
                set({ entries: prev.map((x) => (x.id === entry.id ? updatedEntry : x)) })
            } catch (e) {
                throw (e);
            } finally {
                set({ saving: false });
            }
        },
        deleteEntry: async (id) => {
            set({ deleting: true });
            const prev = get().entries;
            try {
                await deleteCompendiumEntry(id);
                set({ entries: prev.filter((e) => e.id !== id) });
            } catch (e) {
                throw (e);
            } finally {
                set({ deleting: false });
            }
        }
    })
);

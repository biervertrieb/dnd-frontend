import { create } from "zustand";
import type { CompendiumEntry } from "../features/compendium/types";
import { getCompendiumEntryByID } from "../features/compendium/api";

type AppState = {
    openedCompendiumNote: CompendiumEntry | null,
    showingCompendiumNote: boolean,
    compendiumLoading: boolean,
    error: string | null,
}

type AppActions = {
    openCompendiumNote: (id: string) => Promise<void>,
    closeCompendiumNote: () => void,
}

export const useAppStore = create<AppState & AppActions>()(
    (set, get) => ({
        openedCompendiumNote: null,
        showingCompendiumNote: false,
        compendiumLoading: false,
        error: null,
        closeCompendiumNote: () => {
            set({ showingCompendiumNote: false });
        },
        openCompendiumNote: async (id: string) => {
            set({ showingCompendiumNote: true });
            const prev = get().openedCompendiumNote;
            if (prev && (id === prev.id || id === prev.slug))
                return;
            set({ compendiumLoading: true });
            try {
                const loaded = await getCompendiumEntryByID(id);
                set({ openedCompendiumNote: loaded });
                set({ error: null });
            } catch (e) {
                set({ error: (e as Error).message })
            } finally {
                set({ compendiumLoading: false });
            }
        },
    })
)

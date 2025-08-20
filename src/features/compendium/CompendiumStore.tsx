import { create } from "zustand";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";

type CompendiumState = {
    entries: CompendiumEntry[],
    showNewEntry: boolean,
}

type CompendiumActions = {
    setShowNewEntry: (showState: boolean) => void,
    setEntries: (entries: CompendiumEntry[]) => void,
}


export const useCompendiumStore = create<CompendiumState & CompendiumActions>()(
    (set, get) => ({
        entries: [],
        showNewEntry: false,
        setShowNewEntry: (showState) => set(() => ({ showNewEntry: showState })),
        setEntries: (entries) => set(() => ({ entries: entries })),
    })
)

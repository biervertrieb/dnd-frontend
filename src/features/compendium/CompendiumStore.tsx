import { create } from "zustand";
import { combine } from "zustand/middleware";
import type { CompendiumEntry } from "./types.ts";
import { createCompendiumEntry, deleteCompendiumEntry, getCompendiumEntries, updateCompendiumEntry } from "./api.ts";


export const useCompendiumStore = create(
    combine(
        {
            showNewEntry: false,
        },
        (set) => ({
            setShowNewEntry: (showState: boolean) => set(() => ({ showNewEntry: showState })),
        })
    )
)

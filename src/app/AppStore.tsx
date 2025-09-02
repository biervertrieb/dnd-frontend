import { create } from "zustand";
import type { CompendiumEntry } from "../features/compendium/types";
import { getCompendiumEntryByID } from "../features/compendium/api";

import { apiPost } from "../shared/api";

type AppState = {
    openedCompendiumNote: CompendiumEntry | null,
    showingCompendiumNote: boolean,
    compendiumLoading: boolean,
    error: string | null,

    token: string | null,
    user: string | null,
    isAuthenticated: boolean,
    authLoading: boolean,
    authError: string | null,
}

type AppActions = {
    openCompendiumNote: (id: string) => Promise<void>,
    closeCompendiumNote: () => void,

    login: (username: string, password: string) => Promise<void>,
    logout: () => void,
    register: (username: string, password: string) => Promise<void>,
}

export const useAppStore = create<AppState & AppActions>()(
    (set, get) => ({
        openedCompendiumNote: null,
        showingCompendiumNote: false,
        compendiumLoading: false,
        error: null,

        token: localStorage.getItem("jwt") ?? null,
        user: localStorage.getItem("user") ?? null,
        isAuthenticated: !!localStorage.getItem("jwt"),
        authLoading: false,
        authError: null,
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

        login: async (username: string, password: string) => {
            set({ authLoading: true, authError: null });
            try {
                const res = await apiPost<{ token: string; user: string }>("/login", { username, password });
                localStorage.setItem("jwt", res.token);
                localStorage.setItem("user", res.user);
                set({ token: res.token, user: res.user, isAuthenticated: true, authError: null });
            } catch (e: any) {
                set({ authError: e.message || "Login failed" });
            } finally {
                set({ authLoading: false });
            }
        },

        logout: () => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            set({ token: null, user: null, isAuthenticated: false });
        },

        register: async (username: string, password: string) => {
            set({ authLoading: true, authError: null });
            try {
                const res = await apiPost<{ token: string; user: string }>("/register", { username, password });
                localStorage.setItem("jwt", res.token);
                localStorage.setItem("user", res.user);
                set({ token: res.token, user: res.user, isAuthenticated: true, authError: null });
            } catch (e: any) {
                set({ authError: e.message || "Registration failed" });
            } finally {
                set({ authLoading: false });
            }
        },
    })
);

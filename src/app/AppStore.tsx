import { create } from "zustand";
import type { CompendiumEntry } from "../features/compendium/types";
import { getCompendiumEntryByID } from "../features/compendium/api";

import { apiLogin, apiLogout, apiRegister, getCurrentUser } from "../auth/api";

type AppState = {
    openedCompendiumNote: CompendiumEntry | null,
    showingCompendiumNote: boolean,
    compendiumLoading: boolean,
    error: string | null,

    at: string | null,
    user: string | null,
    isAuthenticated: boolean,
    authLoading: boolean,
    authError: string | null,
}

type AppActions = {
    openCompendiumNote: (id: string) => Promise<void>,
    closeCompendiumNote: () => void,

    setAccessToken: (token: string) => void,
    setAuthenticated: (auth: boolean) => void,
    authenticate: () => Promise<void>,
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

        at: null,
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,
        setAccessToken: (token: string) => {
            set({ at: token });
        },
        setAuthenticated: (auth: boolean) => {
            set({ isAuthenticated: auth });
        },
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

        authenticate: async () => {
            set({ authLoading: true, authError: null });
            try {
                const res = await getCurrentUser();
                if (res && res.accessToken && res.user) {
                    set({
                        user: res.user.username,
                        isAuthenticated: true,
                        at: res.accessToken,
                        authError: null,
                    });
                } else {
                    set({
                        authError: null,
                        isAuthenticated: false,
                        user: null,
                        at: null,
                    });
                }
            } catch (e: any) {
                set({
                    authError: null,
                    isAuthenticated: false,
                    user: null,
                    at: null,
                });
            } finally {
                set({ authLoading: false });
            }
        },

        login: async (username: string, password: string) => {
            set({ authLoading: true, authError: null });
            try {
                const res = await apiLogin({ username, password });
                if (!res.accessToken) {
                    throw new Error("Invalid login response");
                }
                set({ user: res.user.username, authError: null, isAuthenticated: true, at: res.accessToken });
            } catch (e: any) {
                set({ authError: e.message || "Login failed", isAuthenticated: false, user: null, at: null });
            } finally {
                set({ authLoading: false });
            }
        },

        logout: () => {
            set({ user: null, isAuthenticated: false, at: null, authError: null });
            apiLogout().catch(() => { /* Ignore logout errors */ });
        },

        register: async (username: string, password: string) => {
            set({ authLoading: true, authError: null });
            try {
                await apiRegister({ username, password });
            } catch (e: any) {
                set({ authError: e.message || "Registration failed" });
            } finally {
                set({ authLoading: false });
            }
        },
    })
);

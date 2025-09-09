import { create } from "zustand";
import type { CompendiumEntry } from "../features/compendium/types";
import { getCompendiumEntryByID } from "../features/compendium/api";

import { apiPost } from "../shared/api";
import { apiLogin, apiRegister, getCurrentUser, getRefreshToken } from "../features/auth/api";

type AppState = {
    openedCompendiumNote: CompendiumEntry | null,
    showingCompendiumNote: boolean,
    compendiumLoading: boolean,
    error: string | null,

    user: string | null,
    isAuthenticated: boolean,
    authLoading: boolean,
    authError: string | null,
}

type AppActions = {
    openCompendiumNote: (id: string) => Promise<void>,
    closeCompendiumNote: () => void,

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

        user: localStorage.getItem("user") ?? null,
        isAuthenticated: false,
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

        authenticate: async () => {
            set({ authLoading: true, authError: null });
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                set({ isAuthenticated: false });
                return;
            }
            try {
                // Try to fetch a protected resource
                const auth = await getCurrentUser();
                set({ isAuthenticated: true });
                set({ user: auth.user.username });
                localStorage.setItem("user", auth.user.username);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                set({ isAuthenticated: false, authError: "could not authenticate with token", user: null });
            } finally {
                set({ authLoading: false });
            }
        },

        login: async (username: string, password: string) => {
            set({ authLoading: true, authError: null });
            try {
                const res = await apiLogin({ username, password });
                if (!res.accessToken || !res.refreshToken) {
                    throw new Error("Invalid login response");
                }
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("user", res.user.username);
                set({ user: res.user.username, authError: null, isAuthenticated: true });
            } catch (e: any) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                set({ authError: e.message || "Login failed", isAuthenticated: false, user: null });
            } finally {
                set({ authLoading: false });
            }
        },

        logout: () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                apiPost("/auth/logout", { refreshToken }).catch(() => { /* Ignore errors on logout */ });
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            set({ user: null, isAuthenticated: false });
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

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
    authPromise: Promise<void> | null,
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
        authPromise: null,
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
            if (get().authPromise) {
                return get().authPromise;
            }
            set({
                authPromise: (async () => {
                    set({ authLoading: true, authError: null });
                    if (get().isAuthenticated) {
                        set({ authLoading: false });
                        return;
                    }
                    try {
                        const API_URL = import.meta.env.VITE_API_URL as string;
                        const res = await fetch(`${API_URL}/auth/refresh`, {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                        })
                        if (res.ok) {
                            const session = await res.json();
                            if (session && session.accessToken && session.user) {
                                set({
                                    user: session.user.username,
                                    isAuthenticated: true,
                                    at: session.accessToken,
                                    authError: null,
                                });
                            }
                            else {
                                set({
                                    authError: null,
                                    isAuthenticated: false,
                                    user: null,
                                    at: null,
                                });
                            }
                        }
                        else {
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
                })()
            });
            return get().authPromise;
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

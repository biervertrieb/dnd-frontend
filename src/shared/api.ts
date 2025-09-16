import { useAppStore } from "../app/AppStore";

const API_URL = import.meta.env.VITE_API_URL as string;

function getAccessToken() {
    return useAppStore.getState().at;
}

function setAccessToken(token: string) {
    useAppStore.getState().setAccessToken(token);
}

function setAuthenticated(auth: boolean) {
    useAppStore.getState().setAuthenticated(auth);
}

let refreshPromise: Promise<boolean> | null = null;

async function getRefreshedAccessToken(): Promise<boolean> {
    if (refreshPromise) {
        return refreshPromise;
    }
    refreshPromise = (async () => {
        const isAuthenticated = useAppStore.getState().isAuthenticated;

        if (!isAuthenticated) {
            return false; // No need to refresh if not authenticated
        }

        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!res.ok) {
                setAuthenticated(false);
                setAccessToken("");
                refreshPromise = null;
                return false;
            }
            const session = await res.json();
            setAccessToken(session.accessToken);
            refreshPromise = null;
            return true;
        }
        catch {
            setAuthenticated(false);
            setAccessToken("");
            refreshPromise = null;
            return false;
        }
    })();
    return refreshPromise;
}

async function fetchWithAuth<T>(method: string, path: string, body?: unknown, retry = true): Promise<T> {
    const headers: Record<string, string> = {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
    };
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
        if (res.status === 401 && retry) {
            const refreshed = await getRefreshedAccessToken();
            if (refreshed) {
                return fetchWithAuth<T>(method, path, body, false); // Retry the original request
            }
        }
        throw new Error(`${method} ${path} failed: ${res.status}`);
    }
    if (method === "DELETE") {
        return undefined as T;
    }
    return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
    return fetchWithAuth<T>("GET", path);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    return fetchWithAuth<T>("POST", path, body);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
    return fetchWithAuth<T>("PUT", path, body);
}

export async function apiDelete(path: string): Promise<void> {
    return fetchWithAuth<void>("DELETE", path);
}

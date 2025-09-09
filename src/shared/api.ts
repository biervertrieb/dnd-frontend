const API_URL = import.meta.env.VITE_API_URL as string;

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("accessToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function getRefreshedAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
    });
    if (!res.ok) {
        throw new Error(`Refresh token failed: ${res.status}`);
    }
    try {
        localStorage.setItem("accessToken", (await res.json()).accessToken);
    }
    catch {
        throw new Error("Failed to parse refresh token response");
    }
}

export async function apiGet<T>(path: string, retry?: boolean): Promise<T> {
    if (retry === undefined) retry = true;
    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            ...getAuthHeaders(),
        },
    });
    if (!res.ok) {
        if (res.status === 401 && retry) {
            try {
                await getRefreshedAccessToken();
                return apiGet<T>(path, false); // Retry the original request
            } catch {
                // Refresh token failed, fall through to throw original error
            }
        }
        throw new Error(`GET ${path} failed: ${res.status}`);
    }
    return res.json();
}

export async function apiPost<T>(path: string, body: unknown, retry?: boolean): Promise<T> {
    if (retry === undefined) retry = true;
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        if (res.status === 401 && retry) {
            try {
                await getRefreshedAccessToken();
                return apiPost<T>(path, body, false); // Retry the original request
            } catch {
                // Refresh token failed, fall through to throw original error
            }
        }
        throw new Error(`POST ${path} failed: ${res.status}`);
    } return res.json();
}

export async function apiPut<T>(path: string, body: unknown, retry?: boolean): Promise<T> {
    if (retry === undefined) retry = true;
    const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        if (res.status === 401 && retry) {
            try {
                await getRefreshedAccessToken();
                return apiPut<T>(path, body, false); // Retry the original request
            } catch {
                // Refresh token failed, fall through to throw original error
            }
        }
        throw new Error(`PUT ${path} failed: ${res.status}`);
    }
    return res.json();
}

export async function apiDelete(path: string, retry?: boolean): Promise<void> {
    if (retry === undefined) retry = true;
    const res = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    });
    if (!res.ok) {
        if (res.status === 401 && retry) {
            try {
                await getRefreshedAccessToken();
                return apiDelete(path, false); // Retry the original request
            } catch {
                // Refresh token failed, fall through to throw original error
            }
        }
        throw new Error(`DELETE ${path} failed: ${res.status}`);
    }
}

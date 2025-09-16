import { apiGet } from "../shared/api";

const API_URL = import.meta.env.VITE_API_URL as string;

export type AuthResponse = {
    status: string;
    user: {
        id: string;
        username: string;
    };
    accessToken?: string;
    expiresAt?: number;
    message?: string;
};

export type LoginPayload = {
    username: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    password: string;
};

export async function apiLogin(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }
    return res.json();
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
    }
    return res.json();
}

export async function apiLogout(): Promise<void> {
    await fetch(`${API_URL}/auth/refresh/logout`, {
        method: "POST",
        credentials: "include",
    });
}

export async function getCurrentUser(): Promise<AuthResponse> {
    return apiGet<AuthResponse>("/auth/me");
}

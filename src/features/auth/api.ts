import { apiPost, apiGet } from "../../shared/api";

export type AuthResponse = {
    status: string;
    user: {
        id: string;
        username: string;
    };
    accessToken?: string;
    refreshToken?: string;
};

export type LoginPayload = {
    username: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    password: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/auth/login", payload);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/auth/register", payload);
}

export async function getCurrentUser(): Promise<AuthResponse> {
    return apiGet<AuthResponse>("/auth/me");
}

import type { CompendiumEntry } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../shared/api";

type CompendiumApiResponse = {
    status: string;
    entry?: CompendiumEntry;
    message?: string;
}

export async function getCompendiumEntries(): Promise<CompendiumEntry[]> {
    return apiGet<CompendiumEntry[]>("/compendium");
}

export async function getCompendiumEntryByID(id: string): Promise<CompendiumEntry> {
    const res = await apiGet<CompendiumApiResponse>(`/compendium/${id}`);
    if (res.status === "ok" && res.entry !== undefined) {
        return res.entry;
    }
    throw new Error(res.message ?? "something went horribly wrong with the API");
}

export async function getCompendiumEntryBySlug(slug: string): Promise<CompendiumEntry> {
    const res = await apiGet<CompendiumApiResponse>(`/compendium/${slug}`);
    if (res.status === "ok" && res.entry !== undefined) {
        return res.entry;
    }
    throw new Error(res.message ?? "something went horribly wrong with the API");
}

export async function createCompendiumEntry(title: string, tags: string, body: string): Promise<CompendiumEntry> {
    let data = {
        "title": title,
        "tags": tags,
        "body": body
    }
    const res = await apiPost<CompendiumApiResponse>("/compendium", data);
    if (res.status === "ok" && res.entry !== undefined) {
        return res.entry;
    }
    throw new Error(res.message ?? "something went horribly wrong with the API");
}

export async function updateCompendiumEntry(id: string, title: string, tags: string, body: string): Promise<CompendiumEntry> {
    let data = {
        "title": title,
        "tags": tags,
        "body": body
    }
    const res = await apiPut<CompendiumApiResponse>(`/compendium/${id}`, data);
    if (res.status === "ok" && res.entry !== undefined) {
        return res.entry;
    }
    throw new Error(res.message ?? "something went horribly wrong with the API");
}

export async function deleteCompendiumEntry(id: string): Promise<void> {
    return apiDelete(`/compendium/${id}`);
}

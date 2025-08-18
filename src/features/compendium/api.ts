import type { CompendiumEntry } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../shared/api";

export async function getCompendiumEntries(): Promise<CompendiumEntry[]> {
    return apiGet<CompendiumEntry[]>("/compendium");
}

export async function getCompendiumEntryByID(id: string): Promise<CompendiumEntry> {
    return apiGet<CompendiumEntry>(`/compendium/${id}`);
}

export async function getCompendiumEntryBySlug(slug: string): Promise<CompendiumEntry> {
    return apiGet<CompendiumEntry>(`/compendium/${slug}`);
}

export async function createCompendiumEntry(title: string, tags: string, body: string): Promise<CompendiumEntry> {
    let data = {
        "title": title,
        "tags": tags,
        "body": body
    }
    return apiPost<CompendiumEntry>("/compendium", data);
}

export async function updateCompendiumEntry(id: string, title: string, tags: string, body: string): Promise<CompendiumEntry> {
    let data = {
        "title": title,
        "tags": tags,
        "body": body
    }
    return apiPut<CompendiumEntry>(`/compendium/${id}`, data);
}

export async function deleteCompendiumEntry(id: string): Promise<void> {
    return apiDelete(`/compendium/${id}`);
}

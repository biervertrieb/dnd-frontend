import type { JournalEntry, JournalEntryResponse } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../shared/api";

export async function getJournalEntries(): Promise<JournalEntry[]> {
    return apiGet<JournalEntry[]>("/journal");
}

export async function createJournalEntry(title: string, day: string, body: string): Promise<JournalEntry> {
    let data = {
        "title": title,
        "day": day,
        "body": body
    }
    const response = await apiPost<JournalEntryResponse>("/journal", data);
    if (response.entry) {
        return response.entry;
    }
    throw new Error("Failed to create journal entry");
}

export async function updateJournalEntry(id: string, title: string, day: string, body: string): Promise<JournalEntry> {
    let data = {
        "title": title,
        "day": day,
        "body": body
    }
    const response = await apiPut<JournalEntryResponse>(`/journal/${id}`, data);
    if (response.entry) {
        return response.entry;
    }
    throw new Error("Failed to update journal entry");
}

export async function deleteJournalEntry(id: string): Promise<void> {
    return apiDelete(`/journal/${id}`);
}

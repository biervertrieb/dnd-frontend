import type { JournalEntry } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "../../shared/api";

export async function getJournalEntries(): Promise<JournalEntry[]> {
    return apiGet<JournalEntry[]>("/journal");
}

export async function createJournalEntry(data: {
    title: string;
    body: string;
}): Promise<JournalEntry> {
    return apiPost<JournalEntry>("/journal", data);
}

export async function updateJournalEntry(id: string, data: {
    title: string;
    body: string;
}): Promise<JournalEntry> {
    return apiPut<JournalEntry>(`/journal/${id}`, data);
}

export async function deleteJournalEntry(id: string): Promise<void> {
    return apiDelete(`/journal/${id}`);
}

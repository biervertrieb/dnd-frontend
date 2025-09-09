export interface JournalEntry {
    id: string;
    title: string;
    body: string;
    day: string;
    created_at: string;
    updated_at?: string;
}

export type JournalEntryResponse = {
    status: string;
    entry?: JournalEntry;
    message?: string;
}

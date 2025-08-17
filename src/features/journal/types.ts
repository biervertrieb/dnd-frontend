export interface JournalEntry {
    id: string;
    title: string;
    body: string;
    day: string;
    created_at: string;
    updated_at?: string;
}

export type JournalEntryUI = JournalEntry & { editing: boolean, expanded: boolean }

export interface JournalEntry {
    id: string;
    title: string;
    body: string;
    ingame_day: string;
    created_at: string;
    updated_at?: string;
}

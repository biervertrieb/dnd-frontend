export interface CompendiumEntry {
    id: string;
    slug: string;
    title: string;
    body: string;
    tags: string[];
    created_at: string;
    updated_at?: string;
}

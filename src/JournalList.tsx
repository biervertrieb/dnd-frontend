import { useEffect, useState } from "react";

interface JournalEntry {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

export default function JournalList() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/journal")
            .then((res) => res.json())
            .then(setEntries)
            .catch(console.error);
    }, []);

    return (
        <div>
            <h2>Journal Entries</h2>
            <ul>
                {
                    entries.map((entry) => (
                        <li key={entry.id}>
                            <h3>{entry.title}</h3>
                            <div>{entry.body}</div>
                            <small>{entry.created_at}</small>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}


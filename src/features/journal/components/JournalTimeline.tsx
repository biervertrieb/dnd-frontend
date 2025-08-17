import { useState, useEffect } from "react";
import type { JournalEntry } from "../types";
import JournalEntryCard from "./JournalEntryCard";
import { getJournalEntries } from "../api";

const JournalTimeline = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getJournalEntries();
            setEntries(data);
        })();
    }, []);

    return (
        <div className="relative px-8">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg shadow-yellow-500/50"></div>
            {
                entries.map((entry, index) => (<JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                />))
            }
        </div>);
}

export default JournalTimeline;

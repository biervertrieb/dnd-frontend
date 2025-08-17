import { useState, useEffect } from "react";
import type { JournalEntry } from "../types";
import JournalEntryCard from "./JournalEntryCard";
import { getJournalEntries } from "../api";

const TimelineSpine = () => {
    return (
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg shadow-yellow-500/50"></div>
    );
}

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
            <TimelineSpine />
            {
                entries.map((entry, index) => (
                    < div className={`relative mb-10 ${index % 2 === 0 ? 'mr-1/2 pr-10' : 'ml-1/2 pl-10'}`}>
                        <div className={`absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-amber-800 rounded-full top-8 shadow-lg shadow-yellow-500/60 ${index % 2 === 0 ? '-right-12' : '-left-12'}`}></div>
                        <JournalEntryCard
                            key={entry.id}
                            entry={entry}
                        />
                    </div>
                ))
            }
        </div >);
}

export default JournalTimeline;

import type { JournalEntry } from "../types";
import JournalEntryCard from "./JournalEntryCard";

let entries: [JournalEntry];
entries = [
    {
        "id": "1",
        "title": "Entry 1",
        "day": "1",
        "body": "first entry",
        "created_at": "whenever"
    },
    {

        "id": "2",
        "title": "Entry 2",
        "day": "2",
        "body": "second entry",
        "created_at": "whenever"
    },
    {

        "id": "3",
        "title": "Entry 3",
        "day": "3",
        "body": "third entry",
        "created_at": "whenever"
    }
]

const JournalTimeline = () => {
    return (
        <div className="relative px-8">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg shadow-yellow-500/50">
                {
                    entries.map((entry, index) => (<JournalEntryCard key={entry.id} />))
                }
            </div>
        </div>);
}

export default JournalTimeline;

import { useState } from "react";
import JournalTimeline from "./components/JournalTimeline";
import JournalEntryForm from "./components/JournalEntryForm";

const JournalPage = () => {
    const [showNewEntry, setShowNewEntry] = useState(false);
    return (
        <div className="max-w-4xl mx-auto px-5 py-10 mt-32">
            <button
                onClick={() => setShowNewEntry(!showNewEntry)}
                className="mt-8 bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-600 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 transition-all duration-300 font-bold tracking-wider uppercase text-lg"
            >New Entry</button>
            {showNewEntry && (
                <JournalEntryForm />
            )}
            <JournalTimeline />
        </div>
    );
};

export default JournalPage;

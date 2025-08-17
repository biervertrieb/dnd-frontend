import ReactMarkdown from "react-markdown";
import type { JournalEntry } from "../types";

type Props = {
    entry: JournalEntry,
    isFocus: boolean,
    onClick: () => void
}

const JournalEntryCard = ({ entry, isFocus, onClick }: Props) => {

    return (
        <article onClick={onClick} className="px-8 py-8 bg-gradient-to-br from-amber-50/95 to-amber-100/95">
            <header>
                <h3 className="text-2xl font-semibold text-amber-800 mb-1">Day {entry.day}: {entry.title}</h3>
            </header>
            <div className="w-full px-4 py-4">
                {isFocus && (
                    <ReactMarkdown>
                        {entry.body}
                    </ReactMarkdown>
                )}
                {!isFocus && (
                    <ReactMarkdown>
                        {snip(entry.body)}
                    </ReactMarkdown>
                )}
            </div>
        </article>
    );
}

export default JournalEntryCard;

function snip(text: string): string {
    return "snip: " + text;
}

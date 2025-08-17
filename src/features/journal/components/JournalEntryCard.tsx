import type { JournalEntry } from "../types";

type Props = {
    entry: JournalEntry
}

const JournalEntryCard = ({ entry }: Props) => {

    return (
        <article className="px-8 py-8 bg-gradient-to-br from-amber-50/95 to-amber-100/95">
            <header>
                <h3 className="text-2xl font-semibold text-amber-800 mb-1">{entry.title}</h3>
                <time></time>
            </header>
            <div>
                <textarea
                    className="w-full border-2 rounded-lg px-4 py-4"
                    value={entry.body}
                    rows={8}
                >
                </textarea>
            </div>
        </article>
    );
}

export default JournalEntryCard;

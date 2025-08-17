import type { JournalEntry } from "../types";

type Props = {
    entry: JournalEntry,
    index: number
}

const JournalEntryCard = ({ entry, index }: Props) => {

    const isOdd = index % 2 === 0;

    return (
        <div className={`relative mb-10 ${isOdd ? 'mr-1/2 pr-10' : 'ml-1/2 pl-10'}`}>
            <div className={`absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-amber-800 rounded-full top-8 shadow-lg shadow-yellow-500/60 ${isOdd ? '-right-12' : '-left-12'}`}></div>
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
        </div>
    );
}

export default JournalEntryCard;

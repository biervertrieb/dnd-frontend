import { useState, useEffect, useRef } from "react";
import type { CompendiumEntry } from "../types";
import { snip } from "../../../shared/util";
import { styleCardBody, styleCardText, styleCardTextSnip, styleCardTitle } from "../../../shared/styles";
import CustomMarkdown from "../../../shared/CustomMarkdown";
import CardEditor from "../../../shared/CardEditor";

type Mode = "create" | "edit";

type Props = {
    mode: Mode,
    entry?: Partial<CompendiumEntry> & { id?: string },
    isExpanded?: boolean,
    isEditing?: boolean,
    isSaving?: boolean,
    isDeleting?: boolean,
    onClick?: () => void,
    onStartEdit?: () => void,
    onSave: (title: string, tags: string[], body: string) => void,
    onCancel: () => void,
    onDelete?: () => void
}

const CompendiumEntryCard = ({ mode, entry, isExpanded, isDeleting, isEditing, isSaving, onClick, onSave, onStartEdit, onCancel, onDelete }: Props) => {

    const [editTitle, setEditTitle] = useState<string>(entry?.title ?? "");
    const [editTags, setEditTags] = useState<string[]>(entry?.tags ?? []);
    const [editBody, setEditBody] = useState<string>(entry?.body ?? "");

    const ref = useRef<HTMLElement>(null);

    const editing = isEditing ?? false;
    const saving = isSaving ?? false;
    const deleting = isDeleting ?? false;

    useEffect(() => {
        setEditTitle(entry?.title ?? "");
        setEditTags(entry?.tags ?? []);
        setEditBody(entry?.body ?? "");
    }, [entry?.title, entry?.tags, entry?.body]);

    useEffect(() => {
        if (isExpanded && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [isExpanded]);

    const handleSave = () => {
        onSave(editTitle, editTags, editBody);
    }

    return (
        <article ref={ref} onClick={onClick} className={styleCardBody}>
            <header>
                {mode === "create" || editing ? (
                    <div className={styleCardTitle}>
                        <span>Tags </span>
                        <input type="text"
                            className="border-2 border-amber-800 rounded-lg w-10 text-center"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                        />
                        <span> : </span>
                        <input type="text"
                            className="border-2 border-amber-800 rounded-lg"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </div>
                ) : (
                    <h3 className={styleCardTitle}>Tags {entry?.tags ?? "0"} : {entry?.title ?? "untitled"}</h3>
                )}
            </header>
            {mode === "create" || editing ? (
                <CardEditor
                    value={editBody}
                    onChange={setEditBody}
                    className="w-full text-justify bg-amber-50/80 border-2 border-amber-900 rounded-lg px-4 py-4 text-amber-900 text-lg leading-relaxed resize-y min-h-32 focus:outline-none focus:border-yellow-500 focus:shadow-lg focus:shadow-yellow-500/20"
                    rows={8}
                />
            ) : isExpanded ? (
                <>
                    <div className={styleCardText}>
                        <CustomMarkdown markdown={entry?.body ?? ""} />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                        {entry?.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-amber-300/40 text-amber-700 px-2 py-1 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </>
            ) : (
                <div className={styleCardTextSnip}>
                    <CustomMarkdown markdown={snip(entry?.body ?? "")} />
                </div>
            )}
            {/* Controls */}
            {deleting ? (
                <div className="">deleting...</div>
            ) : saving ? (
                <div className="">saving...</div>
            ) : mode === "create" || editing ? (
                <div className="flex gap-3 mt-6 pt-5 border-t-2 border-amber-700/20">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-green-800 to-green-700 border border-green-400 text-green-300 px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                    >
                        💾 Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gradient-to-r from-amber-800 to-amber-700 border border-yellow-600 text-yellow-400 px-4 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                    >
                        ❌ Cancel
                    </button>
                    {
                        mode === "edit" && (
                            <button onClick={onDelete}>DELETE</button>
                        )
                    }
                </div>
            ) : isExpanded && (
                <div className="flex gap-3 mt-6 pt-5 border-t-2 border-amber-700/20">
                    <button
                        onClick={onStartEdit}
                        className="bg-gradient-to-r from-amber-800 to-amber-700 border border-yellow-600 text-yellow-400 px-4 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                    >
                        ✏️ Edit
                    </button>
                </div>
            )}
        </article>
    );
}

export default CompendiumEntryCard;

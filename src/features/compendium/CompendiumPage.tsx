import { useState } from "react";
import CompendiumOverview from "./components/CompendiumOverview";
import CompendiumEntryCard from "./components/CompendiumEntryCard";
import { createCompendiumEntry } from "./api";
import { useCompendiumStore } from "./CompendiumStore";

const CompendiumPage = () => {
    const showNewEntry = useCompendiumStore().showNewEntry;
    const setShowNewEntry = useCompendiumStore().setShowNewEntry;
    //const [showNewEntry, setShowNewEntry] = useState(false);
    const [saving, setSaving] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const createEntry = async (title: string, tags: string, body: string) => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        setSaving(true);
        try {
            await createCompendiumEntry(title, tags, body)
            setShowNewEntry(false);
            setReloadKey((k) => k + 1);
        }
        catch (e) {
            console.error(e);
            alert("Failed to update entry.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-5 py-10 mt-32">
            <button
                onClick={() => setShowNewEntry(!showNewEntry)}
                className="mt-8 bg-gradient-to-r from-amber-800 to-amber-700 border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-600 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 transition-all duration-300 font-bold tracking-wider uppercase text-lg"
            >New Entry</button>
            {showNewEntry && (
                <CompendiumEntryCard
                    mode="create"
                    onCancel={() => setShowNewEntry(false)}
                    onSave={(title, tags, body) => createEntry(title, tags, body)}
                    isSaving={saving}
                />
            )}
            <CompendiumOverview
                reloadKey={reloadKey}
            />
        </div>
    );
};

export default CompendiumPage;

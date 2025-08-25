import { useAppStore } from "../../app/AppStore";
import Modal from "./Modal";

const CompendiumModal = () => {
    const showingCompendiumNote = useAppStore((s) => s.showingCompendiumNote);

    if (!showingCompendiumNote) return null;
    return (
        <Modal>
            <div>Compendium Card coming soon...</div>
        </Modal>
    );
};

export default CompendiumModal;

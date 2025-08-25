import { useAppStore } from "../../app/AppStore";
import Modal from "./Modal";

const CompendiumModal = () => {
    const showing = useAppStore((s) => s.showingCompendiumNote);

    if (!showing) return null;
    return (
        <Modal>
            <div>Compendium Card coming soon...</div>
        </Modal>
    );
};

export default CompendiumModal;

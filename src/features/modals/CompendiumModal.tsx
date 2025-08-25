import { useAppStore } from "../../app/AppStore";
import Modal from "./Modal";

const CompendiumModal = () => {
    const showing = useAppStore((s) => s.showingCompendiumNote);
    const loading = useAppStore((s) => s.compendiumLoading);

    if (!showing) return null;
    return (
        <Modal>
            {loading ? (
                <div>Loading....</div>
            ) : (
                <div>Compendium Card coming soon...</div>
            )}
        </Modal>
    );
};

export default CompendiumModal;

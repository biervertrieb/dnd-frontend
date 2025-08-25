import { useAppStore } from "../../app/AppStore";
import { styleCardBody, styleCardText, styleCardTitle } from "../../shared/styles";
import Modal from "./Modal";

const CompendiumModal = () => {
    const showing = useAppStore((s) => s.showingCompendiumNote);
    const loading = useAppStore((s) => s.compendiumLoading);
    const err = useAppStore((s) => s.error);

    if (!showing) return null;
    return (
        <Modal>
            {loading ? (
                <div>Loading....</div>
            ) : err ? (
                <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{err}</div>
            ) : (
                <div className={styleCardBody}>
                    <div className={styleCardTitle}>
                        Compendium Card
                    </div>
                    <div className={styleCardText}>
                        coming soon...
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CompendiumModal;

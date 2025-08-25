import { useAppStore } from "../../app/AppStore";
import CustomMarkdown from "../../shared/CustomMarkdown";
import { styleCardBody, styleCardText, styleCardTitle } from "../../shared/styles";
import Modal from "./Modal";

const CompendiumModal = () => {
    const showing = useAppStore((s) => s.showingCompendiumNote);
    const loading = useAppStore((s) => s.compendiumLoading);
    const err = useAppStore((s) => s.error);
    const compEntry = useAppStore((s) => s.openedCompendiumNote);

    if (!showing) return null;
    return (
        <Modal>
            {loading ? (
                <div>Loading....</div>
            ) : err ? (
                <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 6 }}>{err}</div>
            ) : (
                <>
                    <header>
                        <h3 className={styleCardTitle}>
                            {compEntry?.title}
                        </h3>
                    </header>
                    <div className={styleCardText}>
                        <CustomMarkdown markdown={compEntry?.body} />
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CompendiumModal;

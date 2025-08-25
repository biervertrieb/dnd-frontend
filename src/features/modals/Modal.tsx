import { useEffect } from "react";
import { useAppStore } from "../../app/AppStore";
import { styleCardBody, styleModalBackdrop } from "../../shared/styles";

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {

    const closeCompendiumNote = useAppStore((s) => s.closeCompendiumNote);

    useEffect(() => {

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        }
        document.addEventListener('keydown', handleEscape);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = prev;
        }
    }, []);

    const handleClose = () => {
        closeCompendiumNote();
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    }

    return (
        <div className={styleModalBackdrop} onClick={handleBackdropClick}>
            <div className={[
                styleCardBody,
                "relative w-full max-w-lg",             // take full width, then clamp by max-w-*
                "mx-4 sm:mx-6 mt-16 mb-10",    // margins around the panel
                "max-h-[85vh] overflow-auto",  // scroll inside if content tall
                "p-4 sm:p-6",
            ].join(" ")}>
                <button
                    onClick={handleClose}
                    className="modal-close-btn"
                    aria-label="Close modal"
                >
                    x
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;

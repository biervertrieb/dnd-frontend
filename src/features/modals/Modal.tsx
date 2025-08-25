import { useEffect } from "react";
import { useAppStore } from "../../app/AppStore";

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

const Modal = ({ children, className = '', size = 'md' }: ModalProps) => {

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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={handleBackdropClick}>
            <div className={[
                "relative w-full",             // take full width, then clamp by max-w-*
                sizeClasses[size],
                "mx-4 sm:mx-6 mt-16 mb-10",    // margins around the panel
                "rounded-xl border border-neutral-200/70 bg-white shadow-xl",
                "dark:bg-neutral-900 dark:border-neutral-700",
                "max-h-[85vh] overflow-auto",  // scroll inside if content tall
                "p-4 sm:p-6",
                className,
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

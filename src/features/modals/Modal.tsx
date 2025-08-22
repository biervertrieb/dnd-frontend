import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ children, className = '', size = 'md' }: ModalProps) => {
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

    const navigate = useNavigate();
    const handleClose = () => {
        navigate(-1);
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    }

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className={`modal-content modal-${size} ${className}`}>
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

import React, { useRef } from 'react';
import './css/ErrorCategoriaModal.css';

const ErrorCategoriaModal = ({ onClose, nombreCategoria }) => {
    const modalRef = useRef(null);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    
    return (
        <div className="error-categoria-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="error-categoria-modal-content">
                <div className="error-categoria-modal-icon">!</div>
                <h2 className="error-categoria-modal-title">Error al eliminar</h2>
                <p className="error-categoria-modal-text">
                    La categoría "{nombreCategoria}" no se puede borrar porque está presente en uno o más libros.
                </p>
                <button className="error-categoria-modal-button" onClick={onClose}>
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default ErrorCategoriaModal;

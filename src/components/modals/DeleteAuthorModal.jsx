import React, { useRef } from 'react';
import './DeleteAuthorModal.css';

const DeleteAuthorModal = ({ onClose, onDelete }) => {
    const modalRef = useRef(null);

    // Cerrar modal al hacer click fuera del contenido
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="delete-author-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-author-modal-content">
                <div className="delete-author-modal-icon">&#33;</div>
                <h2 className="delete-author-modal-title">Desactivar usuario</h2>
                <p className="delete-author-modal-text">¿Estás seguro que deseas desactivar a este usuario?</p>
                <button className="delete-author-modal-delete-button" onClick={onDelete}>Desactivar</button>
                <button className="delete-author-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteAuthorModal;

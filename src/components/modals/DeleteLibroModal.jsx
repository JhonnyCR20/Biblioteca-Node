import React, { useRef } from 'react';
import './DeleteLibroModal.css';

const DeleteLibroModal = ({ onClose, onDelete }) => {
    const modalRef = useRef(null);
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    return (
        <div className="delete-libro-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-libro-modal-content">
                <div className="delete-libro-modal-icon">&#33;</div>
                <h2 className="delete-libro-modal-title">Eliminar libro</h2>
                <p className="delete-libro-modal-text">¿Estás seguro que deseas eliminar este libro?</p>
                <button className="delete-libro-modal-delete-button" onClick={onDelete}>Eliminar</button>
                <button className="delete-libro-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteLibroModal;

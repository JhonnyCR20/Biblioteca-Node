import React, { useRef } from 'react';
import './css/DeleteMultaModal.css';

const DeleteMultaModal = ({ onClose, onDelete, multa }) => {
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };    return (
        <div className="delete-multa-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-multa-modal-content">
                <div className="delete-multa-modal-icon">!</div>
                <h2 className="delete-multa-modal-title">Eliminar multa</h2>                <p className="delete-multa-modal-text">
                    ¿Estás seguro que deseas eliminar esta multa por ₡{parseFloat(multa.monto || 0).toFixed(2)}?
                </p>
                <button className="delete-multa-modal-delete-button" onClick={onDelete}>Eliminar</button>
                <button className="delete-multa-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteMultaModal;

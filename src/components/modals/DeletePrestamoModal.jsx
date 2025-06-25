import React, { useRef } from 'react';
import './css/DeletePrestamoModal.css';

const DeletePrestamoModal = ({ onClose, onDelete, prestamo }) => {
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="delete-prestamo-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-prestamo-modal-content">
                <div className="delete-prestamo-modal-icon">!</div>
                <h2 className="delete-prestamo-modal-title">Eliminar préstamo</h2>
                <p className="delete-prestamo-modal-text">
                    ¿Estás seguro que deseas eliminar el préstamo ID {prestamo.id_prestamo}?
                </p>
                <button className="delete-prestamo-modal-delete-button" onClick={onDelete}>Eliminar</button>
                <button className="delete-prestamo-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeletePrestamoModal;

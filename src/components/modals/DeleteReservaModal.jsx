import React, { useRef } from 'react';
import './DeleteReservaModal.css';

const DeleteReservaModal = ({ onClose, onDelete, reserva }) => {
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="delete-reserva-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-reserva-content">
                <div className="delete-reserva-header">
                    <h2>Confirmar Eliminación</h2>
                </div>
                <div className="delete-reserva-body">
                    <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
                    <div className="reserva-info">
                        <p><strong>ID:</strong> {reserva.id_reserva}</p>
                        <p><strong>Libro:</strong> {reserva.id_libro}</p>
                        <p><strong>Lector:</strong> {reserva.id_lector}</p>
                        <p><strong>Fecha:</strong> {reserva.fecha_reserva}</p>
                        <p><strong>Estado:</strong> {reserva.estado}</p>
                    </div>
                    <p className="warning-text">Esta acción no se puede deshacer.</p>
                </div>
                <div className="delete-reserva-actions">
                    <button onClick={onDelete} className="confirm-delete-button">
                        Eliminar
                    </button>
                    <button onClick={onClose} className="cancel-delete-button">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteReservaModal;

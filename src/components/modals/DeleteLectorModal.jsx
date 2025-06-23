import React, { useRef } from 'react';
import './css/DeleteLectorModal.css';

const DeleteLectorModal = ({ onClose, onDelete, lector }) => {
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="delete-lector-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-lector-content">
                <div className="delete-lector-header">
                    <h2>Confirmar Eliminación</h2>
                </div>
                <div className="delete-lector-body">
                    <p>¿Estás seguro de que deseas eliminar este lector?</p>                    <div className="lector-info">
                        <p><strong>ID:</strong> {lector.id_lector}</p>
                        <p><strong>Nombre:</strong> {lector.nombre}</p>
                        <p><strong>Correo:</strong> {lector.correo}</p>
                        {lector.telefono && <p><strong>Teléfono:</strong> {lector.telefono}</p>}
                        {lector.direccion && <p><strong>Dirección:</strong> {lector.direccion}</p>}
                    </div>
                    <p className="warning-text">Esta acción no se puede deshacer.</p>
                </div>
                <div className="delete-lector-actions">
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

export default DeleteLectorModal;

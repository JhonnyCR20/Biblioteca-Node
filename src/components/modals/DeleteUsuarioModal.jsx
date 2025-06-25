import React, { useRef } from 'react';
import './css/DeleteUsuarioModal.css';

const DeleteUsuarioModal = ({ onClose, onDelete, usuario }) => {
    const modalRef = useRef(null);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    
    const handleDelete = () => {
        console.log(`Ejecutando onDelete en DeleteUsuarioModal para usuario ID: ${usuario?.id_usuario}`);
        onDelete();
    };

    return (
        <div className="delete-usuario-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-usuario-modal-content">
                <div className="delete-usuario-modal-icon">!</div>
                <h2 className="delete-usuario-modal-title">Eliminar usuario</h2>
                <p className="delete-usuario-modal-text">
                    ¿Estás seguro que deseas eliminar el usuario "{usuario?.nombre}"?
                </p>
                <p className="delete-usuario-modal-warning">
                    Esta acción no se puede deshacer.
                </p>
                <button className="delete-usuario-modal-delete-button" onClick={handleDelete}>Eliminar</button>
                <button className="delete-usuario-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteUsuarioModal;

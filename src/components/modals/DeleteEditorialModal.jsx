import React, { useRef } from 'react';
import './css/DeleteEditorialModal.css';

const DeleteEditorialModal = ({ onClose, onDelete, editorial }) => {
    const modalRef = useRef(null);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    
    const handleDelete = () => {
        console.log(`Ejecutando onDelete en DeleteEditorialModal para editorial ID: ${editorial?.id_editorial}`);
        onDelete();
    };
      return (
        <div className="delete-editorial-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-editorial-modal-content">
                <div className="delete-editorial-modal-icon">!</div>
                <h2 className="delete-editorial-modal-title">Eliminar editorial</h2>
                <p className="delete-editorial-modal-text">
                    ¿Estás seguro que deseas eliminar la editorial "{editorial?.nombre}"?
                </p>
                <button className="delete-editorial-modal-delete-button" onClick={handleDelete}>Eliminar</button>
                <button className="delete-editorial-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteEditorialModal;

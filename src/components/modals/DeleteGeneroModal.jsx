import React, { useRef } from 'react';
import './DeleteGeneroModal.css';

const DeleteGeneroModal = ({ onClose, onDelete, genero }) => {
    const modalRef = useRef(null);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    
    const handleDelete = () => {
        console.log(`Ejecutando onDelete en DeleteGeneroModal para género ID: ${genero?.id_categoria}`);
        onDelete();
    };
    
    return (
        <div className="delete-genero-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="delete-genero-modal-content">
                <div className="delete-genero-modal-icon">!</div>
                <h2 className="delete-genero-modal-title">Eliminar categoría</h2>
                <p className="delete-genero-modal-text">
                    ¿Estás seguro que deseas eliminar la categoría "{genero?.nombre}"?
                </p>
                <button className="delete-genero-modal-delete-button" onClick={handleDelete}>Eliminar</button>
                <button className="delete-genero-modal-cancel-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default DeleteGeneroModal;

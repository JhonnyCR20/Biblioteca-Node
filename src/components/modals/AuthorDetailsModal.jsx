import React, { useState, useRef } from 'react';
import './css/AuthorDetailsModal.css';
import EditCreateAuthor from './EditCreateAuthor';
import editarIcon from '../../assets/editar.svg';
import DeleteAuthorModal from './DeleteAuthorModal';

const AuthorDetailsModal = ({ autor, onClose, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalRef = useRef(null);

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Cerrar modal al hacer click fuera del contenido
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!autor) return null;

    return (
        <>
            <div className="author-details-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="author-details-modal-content">
                    <div className="author-details-modal-header">
                        <h2>Detalles del Autor</h2>                        <button className="author-details-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="author-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>
                    <div className="author-details-modal-body">
                        <p><strong>ID:</strong> {autor.id_autor}</p>
                        <p><strong>Nombre:</strong> {autor.nombre}</p>
                        <p><strong>Nacionalidad:</strong> {autor.nacionalidad}</p>
                    </div>
                    <div className="author-details-modal-footer">
                        <button className="author-details-modal-delete-button" onClick={handleDeleteClick}>Eliminar</button>
                        <button className="author-details-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditCreateAuthor
                    onClose={() => {
                        handleCloseEditModal();
                        onClose();
                    }}
                    initialData={autor}
                    onSave={(data) => {
                        onEdit(data);
                        handleCloseEditModal();
                        onClose();
                    }}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteAuthorModal
                    onClose={() => {
                        handleCloseDeleteModal();
                        onClose();
                    }}
                    onDelete={() => {
                        onDelete();
                        handleCloseDeleteModal();
                        onClose();
                    }}
                />
            )}
        </>
    );
};

export default AuthorDetailsModal;

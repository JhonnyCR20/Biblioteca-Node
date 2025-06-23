import React, { useState, useRef } from 'react';
import './EditorialDetailsModal.css';
import EditCreateEditorial from './EditCreateEditorial';
import DeleteEditorialModal from './DeleteEditorialModal';
import editarIcon from '../../assets/editar.svg';

const EditorialDetailsModal = ({ editorial, onClose, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalRef = useRef(null);

    const handleEditClick = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!editorial) return null;

    return (
        <>
            <div className="editorial-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="editorial-modal-content">
                    <div className="editorial-modal-header">
                        <h2>Detalles de la Editorial</h2>                        <button className="editorial-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="editorial-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>
                    <div className="editorial-modal-body">
                        <p><strong>ID:</strong> {editorial.id_editorial}</p>
                        <p><strong>Nombre:</strong> {editorial.nombre}</p>
                        <p><strong>País:</strong> {editorial.pais}</p>
                    </div>                    <div className="editorial-modal-footer">
                        <button className="editorial-modal-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="editorial-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>
              {isEditModalOpen && (
                <EditCreateEditorial
                    initialData={editorial}
                    onClose={() => {
                        handleCloseEditModal();
                        onClose();
                    }}
                    onSave={(data) => {
                        onEdit(data);
                        handleCloseEditModal();
                    }}
                    isEdit={true}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteEditorialModal
                    onClose={handleCloseDeleteModal}
                    onDelete={() => {
                        onDelete();
                        handleCloseDeleteModal();
                        onClose();
                    }}
                    editorial={editorial}
                />
            )}
        </>
    );
};

export default EditorialDetailsModal;

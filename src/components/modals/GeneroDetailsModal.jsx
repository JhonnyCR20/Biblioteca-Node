import React, { useState, useRef } from 'react';
import './css/GeneroDetailsModal.css';
import EditCreateGenero from './EditCreateGenero';
import DeleteGeneroModal from './DeleteGeneroModal';
import editarIcon from '../../assets/editar.svg';

const GeneroDetailsModal = ({ genero, onClose, onEdit, onDelete }) => {
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

    if (!genero) return null;

    return (
        <>
            <div className="genero-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="genero-modal-content">
                    <div className="genero-modal-header">
                        <h2>Detalles de la Categoría</h2>                        <button className="genero-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="genero-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>                    <div className="genero-modal-body">
                        <p><strong>ID:</strong> {genero.id_categoria}</p>
                        <p><strong>Nombre:</strong> {genero.nombre}</p>
                        <p><strong>Descripción:</strong> {genero.descripcion || 'Sin descripción'}</p>
                    </div>
                    <div className="genero-modal-footer">
                        <button className="genero-modal-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="genero-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditCreateGenero
                    initialData={genero}
                    onClose={handleCloseEditModal}
                    onSave={(datosEditados) => {
                        onEdit(datosEditados);
                        handleCloseEditModal();
                    }}
                    isEdit={true}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteGeneroModal
                    onClose={handleCloseDeleteModal}
                    onDelete={() => {
                        onDelete();
                        handleCloseDeleteModal();
                    }}
                    genero={genero}
                />
            )}
        </>
    );
};

export default GeneroDetailsModal;

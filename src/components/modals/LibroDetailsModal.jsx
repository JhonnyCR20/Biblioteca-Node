import React, { useState, useRef } from 'react';
import './LibroDetailsModal.css';
import EditCreateLibro from './EditCreateLibro';
import DeleteLibroModal from './DeleteLibroModal';
import editarIcon from '../../assets/editar.svg';

const LibroDetailsModal = ({ libro, onClose, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalRef = useRef(null);

    const handleEditClick = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleDeleteClick = () => setIsDeleteModalOpen(true);
    const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!libro) return null;

    return (
        <>
            <div className="libro-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="libro-modal-content">
                    <div className="libro-modal-header">
                        <h2>Detalles del Libro</h2>
                        <button className="libro-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="edit-icon" />
                        </button>
                    </div>
                    <div className="libro-modal-body">
                        <p><strong>ID:</strong> {libro.id_libro}</p>
                        <p><strong>Título:</strong> {libro.titulo}</p>
                        <p><strong>Autor:</strong> {libro.autores && libro.autores.length > 0 ? libro.autores[0].nombre : ''}</p>
                        <p><strong>Fecha Publicación:</strong> {libro.anio_publicacion}</p>
                        <p><strong>Género:</strong> {libro.categoria_nombre}</p>
                        <p><strong>Editorial:</strong> {libro.editorial_nombre}</p>
                        <p><strong>ISBN:</strong> {libro.isbn}</p>
                        <p><strong>Cantidad Disponible:</strong> {libro.cantidad_disponible}</p>
                    </div>
                    <div className="libro-modal-footer">
                        <button className="libro-modal-delete-button" onClick={handleDeleteClick}>Eliminar</button>
                        <button className="libro-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditCreateLibro
                    initialData={libro}
                    onClose={() => {
                        handleCloseEditModal();
                        onClose();
                    }}
                    onSave={(data) => {
                        onEdit(data);
                        handleCloseEditModal();
                        onClose();
                    }}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteLibroModal
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

export default LibroDetailsModal;

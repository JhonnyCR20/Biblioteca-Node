import React, { useState, useRef } from 'react';
import './css/LectorDetailsModal.css';
import EditCreateLector from './EditCreateLector';
import DeleteLectorModal from './DeleteLectorModal';
import editarIcon from '../../assets/editar.svg';

const LectorDetailsModal = ({ lector, onClose, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalRef = useRef(null);

    // Debug: ver qué datos está recibiendo el modal
    console.log('🔍 Modal de detalles - lector recibido:', lector);

    const handleEditClick = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!lector) return null;

    return (
        <>
            <div className="lector-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="lector-modal-content">
                    <div className="lector-modal-header">
                        <h2>Detalles del Lector</h2>
                        <button className="lector-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="lector-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>                    <div className="lector-modal-body">
                        <p><strong>ID:</strong> {lector.id_lector}</p>
                        <p><strong>Nombre:</strong> {lector.nombre}</p>
                        <p><strong>Correo:</strong> {lector.correo}</p>
                        <p><strong>Teléfono:</strong> {lector.telefono || 'No especificado'}</p>
                        <p><strong>Dirección:</strong> {lector.direccion || 'No especificada'}</p>
                    </div>
                    <div className="lector-modal-footer">
                        <button className="lector-modal-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="lector-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditCreateLector
                    initialData={lector}
                    onClose={handleCloseEditModal}
                    onSave={(datosEditados) => {
                        onEdit(datosEditados);
                        handleCloseEditModal();
                    }}
                    isEdit={true}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteLectorModal
                    onClose={handleCloseDeleteModal}
                    onDelete={onDelete}
                    lector={lector}
                />
            )}
        </>
    );
};

export default LectorDetailsModal;

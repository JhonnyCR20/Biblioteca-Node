import React, { useState, useRef } from 'react';
import './css/UsuarioDetailsModal.css';
import EditCreateUsuario from './EditCreateUsuario';
import DeleteUsuarioModal from './DeleteUsuarioModal';
import editarIcon from '../../assets/editar.svg';

const UsuarioDetailsModal = ({ usuario, onClose, onEdit, onDelete }) => {
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
    };    const formatearRol = (rol) => {
        return rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : '';
    };

    if (!usuario) return null;

    return (
        <>
            <div className="usuario-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="usuario-modal-content">
                    <div className="usuario-modal-header">
                        <h2>Detalles del Usuario</h2>
                        <button className="usuario-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="usuario-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>
                    <div className="usuario-modal-body">
                        <p><strong>ID:</strong> {usuario.id_usuario}</p>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo:</strong> {usuario.correo}</p>
                        <p><strong>Rol:</strong> {formatearRol(usuario.rol)}</p>
                        <p><strong>Contraseña:</strong> ••••••••</p>
                    </div>                    <div className="usuario-details-modal-footer">
                        <button className="usuario-details-eliminar-btn" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="usuario-details-regresar-btn" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditCreateUsuario
                    initialData={usuario}
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
                <DeleteUsuarioModal
                    onClose={handleCloseDeleteModal}
                    onDelete={() => {
                        onDelete();
                        handleCloseDeleteModal();
                        onClose();
                    }}
                    usuario={usuario}
                />
            )}
        </>
    );
};

export default UsuarioDetailsModal;

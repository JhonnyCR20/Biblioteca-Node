import React, { useState, useRef } from 'react';
import './css/ReservaDetailsModal.css';
import EditCreateReserva from './EditCreateReserva';
import DeleteReservaModal from './DeleteReservaModal';
import editarIcon from '../../assets/editar.svg';

const ReservaDetailsModal = ({ reserva, onClose, onEdit, onDelete }) => {
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

    if (!reserva) return null;

    return (
        <>
            <div className="reserva-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="reserva-modal-content">
                    <div className="reserva-modal-header">
                        <h2>Detalles de la Reserva</h2>                        <button className="reserva-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="reserva-edit-icon" style={{width: '40px', height: '40px'}} />
                        </button>
                    </div>                    <div className="reserva-modal-body">
                        <p><strong>ID:</strong> {reserva.id_reserva}</p>
                        <p><strong>Libro:</strong> {reserva.titulo_libro || `ID: ${reserva.id_libro}`}</p>
                        <p><strong>Lector:</strong> {reserva.nombre_lector ? `${reserva.nombre_lector} ${reserva.apellido_lector}` : `ID: ${reserva.id_lector}`}</p>
                        <p><strong>Fecha de Reserva:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}</p>
                        <p><strong>Estado:</strong> {reserva.estado}</p>
                    </div>
                    <div className="reserva-modal-footer">
                        <button className="reserva-modal-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="reserva-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditCreateReserva
                    initialData={reserva}
                    onClose={handleCloseEditModal}
                    onSave={(datosEditados) => {
                        onEdit(datosEditados);
                        handleCloseEditModal();
                    }}
                    isEdit={true}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteReservaModal
                    onClose={handleCloseDeleteModal}
                    onDelete={onDelete}
                    reserva={reserva}
                />
            )}
        </>
    );
};

export default ReservaDetailsModal;

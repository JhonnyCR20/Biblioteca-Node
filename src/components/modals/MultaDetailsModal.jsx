import React, { useState, useRef } from 'react';
import './css/MultaDetailsModal.css';
import EditCreateMulta from './EditCreateMulta';
import DeleteMultaModal from './DeleteMultaModal';
import editarIcon from '../../assets/editar.svg';

const MultaDetailsModal = ({ multa, onClose, onEdit, onDelete }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalRef = useRef(null);

    // Debug: ver qué datos está recibiendo el modal
    console.log('🔍 Modal de detalles - multa recibida:', multa);

    const handleEditClick = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!multa) return null;

    return (
        <>
            <div className="multa-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="multa-modal-content">
                    <div className="multa-modal-header">
                        <h2>Detalles de la Multa</h2>                        <button className="multa-modal-edit-button" onClick={handleEditClick} title="Editar">
                            <img src={editarIcon} alt="Editar" className="multa-edit-icon" style={{width: '40px', height: '40px', filter: 'brightness(0)'}} />
                        </button>
                    </div>
                    <div className="multa-modal-body">
                        <p><strong>ID:</strong> {multa.id_multa}</p>
                        <p><strong>ID Préstamo:</strong> {multa.id_prestamo}</p>
                        <p><strong>Monto:</strong> {"₡"}{parseFloat(multa.monto || 0).toFixed(2)}</p>
                        <p><strong>Estado:</strong> 
                            <span style={{
                                marginLeft: '8px',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                backgroundColor: multa.pagado === 1 ? '#d4edda' : '#f8d7da',
                                color: multa.pagado === 1 ? '#155724' : '#721c24'
                            }}>
                                {multa.pagado === 1 ? 'Pagado' : 'Pendiente'}
                            </span>
                        </p>
                        {multa.fecha_multa && <p><strong>Fecha de Multa:</strong> {new Date(multa.fecha_multa).toLocaleDateString('es-ES')}</p>}
                        {multa.descripcion && <p><strong>Descripción:</strong> {multa.descripcion}</p>}
                    </div>
                    <div className="multa-modal-footer">
                        <button className="multa-modal-delete-button" onClick={() => setIsDeleteModalOpen(true)}>Eliminar</button>
                        <button className="multa-modal-close-button" onClick={onClose}>Regresar</button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditCreateMulta
                    initialData={multa}
                    onClose={handleCloseEditModal}
                    onSave={(datosEditados) => {
                        onEdit(datosEditados);
                        handleCloseEditModal();
                    }}
                    isEdit={true}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteMultaModal
                    onClose={handleCloseDeleteModal}
                    onDelete={onDelete}
                    multa={multa}
                />
            )}
        </>
    );
};

export default MultaDetailsModal;

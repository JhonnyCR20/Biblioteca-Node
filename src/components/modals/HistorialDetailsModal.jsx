import React, { useRef } from 'react';
import './css/HistorialDetailsModal.css';

const HistorialDetailsModal = ({ entrada, onClose }) => {
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };    const formatearFecha = (fecha) => {
        try {
            const fechaOriginal = new Date(fecha);
            // Restar un día para corregir la diferencia de zona horaria
            fechaOriginal.setDate(fechaOriginal.getDate() - 1);
            
            return fechaOriginal.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return fecha;
        }
    };const mostrarLector = (idLector) => {
        return idLector ? `Lector ID: ${idLector}` : 'No aplica';
    };

    if (!entrada) return null;

    return (
        <div className="historial-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="historial-modal-content">
                <div className="historial-modal-header">
                    <h2>Detalles de Actividad</h2>
                </div>                <div className="historial-modal-body">
                    <p><strong>ID:</strong> {entrada.id_historial}</p>
                    <p><strong>Lector:</strong> {mostrarLector(entrada.id_lector)}</p>
                    <p><strong>Acción:</strong> {entrada.accion}</p>
                    <p><strong>Fecha y Hora:</strong> {formatearFecha(entrada.fecha)}</p>
                </div>
                <div className="historial-modal-footer">
                    <button className="historial-modal-close-button" onClick={onClose}>
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistorialDetailsModal;

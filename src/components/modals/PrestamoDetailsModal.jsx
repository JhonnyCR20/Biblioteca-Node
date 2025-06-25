import React, { useRef, useState, useEffect } from 'react';
import EditCreatePrestamo from './EditCreatePrestamo';
import { obtenerLibros } from '../../services/librosService';
import { obtenerLectores } from '../../services/lectoresService';
import { obtenerDetallesPorPrestamo } from '../../services/detallesPrestamosService';
import './css/PrestamoDetailsModal.css';

const PrestamoDetailsModal = ({ prestamo, onClose, onEdit, onDelete }) => {
    const modalRef = useRef(null);    const [showEditModal, setShowEditModal] = useState(false);
    const [libroInfo, setLibroInfo] = useState(null);
    const [lectorInfo, setLectorInfo] = useState(null);
    const [detallesPrestamo, setDetallesPrestamo] = useState([]);
    const [librosDelPrestamo, setLibrosDelPrestamo] = useState([]);
    const [loading, setLoading] = useState(true);    useEffect(() => {
        const cargarInformacion = async () => {
            try {
                setLoading(true);
                const [librosData, lectoresData] = await Promise.all([
                    obtenerLibros(),
                    obtenerLectores()
                ]);
                
                // Buscar el lector específico
                const lector = Array.isArray(lectoresData) 
                    ? lectoresData.find(l => l.id_lector == prestamo.id_lector)
                    : null;
                  // Intentar obtener información de los libros del préstamo
                let librosInfo = [];
                let detallesData = [];
                try {
                    detallesData = await obtenerDetallesPorPrestamo(prestamo.id_prestamo);
                    if (Array.isArray(detallesData) && Array.isArray(librosData)) {
                        for (const detalle of detallesData) {
                            const libro = librosData.find(l => l.id_libro == detalle.id_libro);
                            if (libro) {
                                librosInfo.push({
                                    ...libro,
                                    cantidad: detalle.cantidad,
                                    id_detalle: detalle.id_detalle
                                });
                            }
                        }
                    }
                } catch (detallesError) {
                    console.warn('No se pudieron cargar los detalles de libros:', detallesError);
                    // Continuar sin los detalles de libros
                }
                
                console.log('Lector encontrado:', lector);
                console.log('Libros del préstamo:', librosInfo);
                console.log('Datos del préstamo:', prestamo);
                
                setLectorInfo(lector);
                setDetallesPrestamo(detallesData);
                setLibrosDelPrestamo(librosInfo);
            } catch (error) {
                console.error('Error al cargar información:', error);
            } finally {
                setLoading(false);
            }
        };

        if (prestamo && prestamo.id_lector) {
            cargarInformacion();
        } else {
            setLoading(false);
        }
    }, [prestamo]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    const handleEdit = () => {
        console.log('Abriendo modal de edición para préstamo:', prestamo);
        setShowEditModal(true);
    };

    const handleEditSave = (datosEditados) => {
        onEdit(datosEditados);
        setShowEditModal(false);
    };

    const handleDelete = () => {
        console.log('Iniciando eliminación de préstamo:', prestamo);
        onDelete();
    };    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        try {
            const date = new Date(fecha);
            // Verificar que la fecha es válida
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Error en fecha';
        }
    };

    const getEstadoDisplay = (estado) => {
        if (!estado) return 'No especificado';
        return estado.charAt(0).toUpperCase() + estado.slice(1);
    };    return (
        <>
            <div className="prestamo-modal" ref={modalRef} onClick={handleBackdropClick}>
                <div className="prestamo-modal-content">
                    <div className="prestamo-modal-header">
                        <h2>Detalles del Préstamo</h2>                        <button 
                            className="prestamo-modal-edit-button"
                            onClick={handleEdit}
                        >                            <img 
                                src="/src/assets/editar.svg" 
                                alt="Editar" 
                                className="prestamo-edit-icon"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    minWidth: '32px',
                                    minHeight: '32px'
                                }}
                            />
                        </button>
                    </div>                    <div className="prestamo-modal-body">
                        <p><strong>ID Préstamo:</strong> {prestamo.id_prestamo || 'No especificado'}</p>
                        <p><strong>Lector:</strong> {
                            loading ? 'Cargando...' : 
                            lectorInfo ? `${lectorInfo.nombre || ''} ${lectorInfo.apellido || ''}`.trim() : 
                            `ID: ${prestamo.id_lector || 'No especificado'}`
                        }</p>
                        <div>
                            <strong>Libros:</strong>
                            {loading ? (
                                <span> Cargando...</span>
                            ) : librosDelPrestamo.length > 0 ? (
                                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                    {librosDelPrestamo.map((libro, index) => (
                                        <li key={index} style={{ margin: '4px 0' }}>
                                            {libro.titulo} (Cantidad: {libro.cantidad})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span> No hay libros asociados</span>
                            )}
                        </div>                        <p><strong>Fecha de Préstamo:</strong> {formatearFecha(prestamo.fecha_prestamo)}</p>
                        <p><strong>Fecha de Devolución:</strong> {
                            formatearFecha(prestamo.fecha_devolucion_prevista || prestamo.fecha_devolucion)
                        }</p>
                        <p><strong>Estado:</strong> {getEstadoDisplay(prestamo.estado)}</p>
                    </div>
                    <div className="prestamo-modal-footer">
                        <button 
                            onClick={handleDelete}
                            className="prestamo-modal-delete-button"
                        >
                            Eliminar
                        </button>
                        <button 
                            onClick={onClose}
                            className="prestamo-modal-close-button"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
            
            {showEditModal && (
                <EditCreatePrestamo
                    prestamo={prestamo}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditSave}
                    isEdit={true}
                />
            )}
        </>
    );
};

export default PrestamoDetailsModal;

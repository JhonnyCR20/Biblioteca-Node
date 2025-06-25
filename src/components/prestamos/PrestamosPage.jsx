import React, { useEffect, useState } from 'react';
import { 
    obtenerPrestamos, 
    obtenerPrestamoPorId, 
    actualizarPrestamoCompleto, 
    eliminarPrestamo, 
    crearPrestamoCompleto 
} from '../../services/prestamosService';
import PrestamoDetailsModal from '../modals/PrestamoDetailsModal';
import EditCreatePrestamo from '../modals/EditCreatePrestamo';
import DeletePrestamoModal from '../modals/DeletePrestamoModal';
import './prestamos.css';

function PrestamosPage() {
    const [prestamos, setPrestamos] = useState([]);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchPrestamos = async () => {
        try {
            const data = await obtenerPrestamos();
            setPrestamos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            setPrestamos([]);
        }
    };

    useEffect(() => {
        fetchPrestamos();
    }, []);

    const handleVerPrestamo = async (prestamo) => {
        try {
            console.log('👁️ Haciendo clic en Ver préstamo:', prestamo);
            console.log('👁️ ID del préstamo:', prestamo.id_prestamo);
            
            // Obtener datos frescos del préstamo por ID
            const prestamoData = await obtenerPrestamoPorId(prestamo.id_prestamo);
            console.log('👁️ Datos obtenidos para el modal:', prestamoData);
            
            setPrestamoSeleccionado(prestamoData);
            setMostrarDetallesModal(true);
        } catch (error) {
            console.error('❌ Error al obtener los detalles del préstamo:', error);
            alert('Error al obtener los detalles del préstamo: ' + error.message);
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setPrestamoSeleccionado(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (prestamo) => {
        setPrestamoSeleccionado(prestamo);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };    const handleCrearPrestamo = async (nuevoPrestamo) => {
        try {
            await crearPrestamoCompleto(nuevoPrestamo);
            await fetchPrestamos();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear el préstamo:', error);
            alert(`Error al crear el préstamo: ${error.message || error}`);
        }
    };

    const handleEditarPrestamo = async (datosEditados) => {
        try {
            await actualizarPrestamoCompleto(prestamoSeleccionado.id_prestamo, datosEditados);
            await fetchPrestamos();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar el préstamo:', error);
            alert(`Error al editar el préstamo: ${error.message || error}`);
        }
    };

    const handleEliminarPrestamo = async () => {
        try {
            console.log(`Intentando eliminar el préstamo con ID: ${prestamoSeleccionado.id_prestamo}`);
            await eliminarPrestamo(prestamoSeleccionado.id_prestamo);
            console.log('Préstamo eliminado correctamente');
            await fetchPrestamos();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar el préstamo:', error);
            alert(`Error al eliminar el préstamo: ${error.message || error}`);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getEstadoBadge = (estado) => {
        const estilos = {
            activo: { backgroundColor: '#d4edda', color: '#155724' },
            devuelto: { backgroundColor: '#cce5ff', color: '#004085' },
            vencido: { backgroundColor: '#f8d7da', color: '#721c24' }
        };

        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                ...estilos[estado] || { backgroundColor: '#e2e3e5', color: '#495057' }
            }}>
                {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'N/A'}
            </span>
        );
    };

    return (
        <div className="prestamos-container" style={{
            padding: '20px',
            backgroundColor: '#f4f4f9',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: '92vh',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '60px',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            <h1 className="prestamos-title" style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '32px',
                color: '#222',
                width: '100%',
                padding: '0 20px'
            }}>Gestión de Préstamos</h1>
            
            <div className="prestamos-table-wrapper" style={{
                width: '90%',
                maxWidth: '100%',
                background: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                margin: '20px auto 0 auto',
                paddingBottom: '0',
                boxSizing: 'border-box',
                position: 'relative',
                height: '400px'
            }}>                <table className="prestamos-table" style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    backgroundColor: 'white',
                    color: '#333',
                    tableLayout: 'fixed'                }}><thead style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: '10',
                        width: 'calc(100% - 8px)',
                        display: 'table',
                        tableLayout: 'fixed'
                    }}><tr>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopLeftRadius: '8px',
                                paddingLeft: '20px',
                                width: '8%'
                            }}>ID</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                width: '12%'
                            }}>Lector</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                width: '15%'
                            }}>F. Préstamo</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                width: '15%'
                            }}>F. Devolución</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                width: '12%'
                            }}>Estado</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'right',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopRightRadius: '8px',
                                paddingRight: '35px',
                                width: '15%'                            }}>Acciones</th></tr></thead><tbody style={{
                        display: 'block',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '350px',
                        width: '100%'
                    }}>{prestamos.map((prestamo) => (
                            <tr key={prestamo.id_prestamo} style={{
                                display: 'table',
                                width: 'calc(100% - 8px)',
                                tableLayout: 'fixed'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';                            }}>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    paddingLeft: '20px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333',
                                    width: '8%'
                                }}>{prestamo.id_prestamo}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333',
                                    width: '12%'
                                }}>{prestamo.id_lector}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333',
                                    width: '15%'
                                }}>{formatearFecha(prestamo.fecha_prestamo)}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333',
                                    width: '15%'
                                }}>{formatearFecha(prestamo.fecha_devolucion)}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333',
                                    width: '12%'
                                }}>{getEstadoBadge(prestamo.estado)}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #dddddd',
                                    paddingRight: '10px',
                                    width: '15%'
                                }}>
                                    <button 
                                        className="prestamos-button" 
                                        style={{
                                            padding: '8px 50px',
                                            backgroundColor: 'transparent',
                                            color: '#007bff',
                                            border: '2px solid #007bff',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s, color 0.3s',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#007bff';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = '#007bff';
                                        }}
                                        onClick={() => handleVerPrestamo(prestamo)}                                    >
                                        Ver
                                    </button>                                </td></tr>
                        ))}{prestamos.length === 0 && (
                            <tr style={{
                                display: 'table',
                                width: 'calc(100% - 8px)',
                                tableLayout: 'fixed'
                            }}>
                                <td colSpan="6" style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'                                }}>
                                    No hay préstamos para mostrar.                                </td></tr>
                        )}</tbody></table>
            </div>
            
            <div className="crear-prestamo-container" style={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
                margin: '20px auto 0 auto'
            }}>
                <button 
                    className="crear-prestamo-button" 
                    style={{
                        display: 'block',
                        margin: '20px auto',
                        padding: '15px 60px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        maxWidth: '280px',
                        width: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0069d9';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                    }}
                    onClick={() => setMostrarCrearModal(true)}
                >
                    Crear
                </button>
            </div>
            
            {mostrarDetallesModal && prestamoSeleccionado && (
                <PrestamoDetailsModal
                    prestamo={prestamoSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarPrestamo}
                    onDelete={handleEliminarPrestamo}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreatePrestamo
                    onClose={cerrarCrearModal}
                    onSave={handleCrearPrestamo}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && prestamoSeleccionado && (
                <DeletePrestamoModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarPrestamo}
                    prestamo={prestamoSeleccionado}
                />
            )}
        </div>
    );
}

export default PrestamosPage;

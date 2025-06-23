import React, { useEffect, useState } from 'react';
import { obtenerReservas, obtenerReservaPorId, actualizarReserva, eliminarReserva, crearReserva } from '../../services/reservasService';
import ReservaDetailsModal from '../modals/ReservaDetailsModal';
import EditCreateReserva from '../modals/EditCreateReserva';
import DeleteReservaModal from '../modals/DeleteReservaModal';

function ReservasPage() {
    const [reservas, setReservas] = useState([]);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchReservas = async () => {
        try {
            const data = await obtenerReservas();
            setReservas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            setReservas([]);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleVerReserva = async (reserva) => {
        try {
            // Obtener datos frescos de la reserva por ID
            const reservaData = await obtenerReservaPorId(reserva.id_reserva);
            setReservaSeleccionada(reservaData);
            setMostrarDetallesModal(true);
        } catch (error) {
            alert('Error al obtener los detalles de la reserva');
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setReservaSeleccionada(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (reserva) => {
        setReservaSeleccionada(reserva);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };

    const handleCrearReserva = async (nuevaReserva) => {
        try {
            await crearReserva(nuevaReserva);
            await fetchReservas();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            alert(`Error al crear la reserva: ${error.message || error}`);
        }
    };    const handleEditarReserva = async (datosEditados) => {
        try {
            console.log('Datos a editar:', datosEditados);
            console.log('ID de la reserva seleccionada:', reservaSeleccionada.id_reserva);
            await actualizarReserva(reservaSeleccionada.id_reserva, datosEditados);
            await fetchReservas();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar la reserva:', error);
            alert(`Error al editar la reserva: ${error.message || error}`);
        }
    };

    const handleEliminarReserva = async () => {
        try {
            console.log(`Intentando eliminar la reserva con ID: ${reservaSeleccionada.id_reserva}`);
            await eliminarReserva(reservaSeleccionada.id_reserva);
            console.log('Reserva eliminada correctamente');
            await fetchReservas();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            alert(`Error al eliminar la reserva: ${error.message || error}`);
        }
    };

    return (
        <div className="reservas-container" style={{
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
            <h1 className="reservas-title" style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '32px',
                color: '#222',
                width: '100%',
                padding: '0 20px'
            }}>Gestión de Reservas</h1>
            <div className="reservas-table-wrapper" style={{
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
            }}>
                <table className="reservas-table" style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    backgroundColor: 'white',
                    color: '#333',
                    tableLayout: 'fixed'
                }}><thead style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: '10',
                        width: 'calc(100% - 8px)',
                        display: 'table',
                        tableLayout: 'fixed'
                    }}><tr><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopLeftRadius: '8px',
                                paddingLeft: '20px'
                            }}>ID</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Libro</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Lector</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Fecha Reserva</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Estado</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'right',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopRightRadius: '8px',
                                paddingRight: '35px'
                            }}>Acciones</th></tr></thead><tbody style={{
                        display: 'block',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '350px',
                        width: '100%'
                    }}>
                        {reservas.map((reserva) => (
                            <tr 
                                key={reserva.id_reserva} 
                                style={{
                                    display: 'table',
                                    width: 'calc(100% - 8px)',
                                    tableLayout: 'fixed'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    paddingLeft: '20px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{reserva.id_reserva}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{reserva.titulo_libro || `Libro ID: ${reserva.id_libro}`}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{reserva.nombre_lector ? `${reserva.nombre_lector} ${reserva.apellido_lector}` : `Lector ID: ${reserva.id_lector}`}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{reserva.estado}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #dddddd',
                                    paddingRight: '10px'
                                }}>
                                    <button 
                                        className="reservas-button" 
                                        style={{
                                            padding: '8px 30px',
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
                                        onClick={() => handleVerReserva(reserva)}
                                    >
                                        Ver</button>
                                </td>
                            </tr>
                        ))}
                        {reservas.length === 0 && (
                            <tr style={{
                                display: 'table',
                                width: 'calc(100% - 8px)',
                                tableLayout: 'fixed'
                            }}>
                                <td colSpan="6" style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>
                                    No hay reservas para mostrar.</td>
                            </tr>
                        )}
                    </tbody></table>
            </div>
            <div className="crear-reserva-container" style={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
                margin: '20px auto 0 auto'
            }}>
                <button 
                    className="crear-reserva-button" 
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
            
            {mostrarDetallesModal && reservaSeleccionada && (
                <ReservaDetailsModal
                    reserva={reservaSeleccionada}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarReserva}
                    onDelete={handleEliminarReserva}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreateReserva
                    onClose={cerrarCrearModal}
                    onSave={handleCrearReserva}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && reservaSeleccionada && (
                <DeleteReservaModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarReserva}
                    reserva={reservaSeleccionada}
                />
            )}
        </div>
    );
}

export default ReservasPage;

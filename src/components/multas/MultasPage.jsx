import React, { useEffect, useState } from 'react';
import { obtenerMultas, obtenerMultaPorId, actualizarMulta, eliminarMulta, crearMulta } from '../../services/multasService';
import MultaDetailsModal from '../modals/MultaDetailsModal';
import EditCreateMulta from '../modals/EditCreateMulta';
import DeleteMultaModal from '../modals/DeleteMultaModal';
import './multas.css';

function MultasPage() {
    const [multas, setMultas] = useState([]);
    const [multaSeleccionada, setMultaSeleccionada] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchMultas = async () => {
        try {
            const data = await obtenerMultas();
            setMultas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener multas:', error);
            setMultas([]);
        }
    };

    useEffect(() => {
        fetchMultas();
    }, []);

    const handleVerMulta = async (multa) => {
        try {
            console.log('👁️ Haciendo clic en Ver multa:', multa);
            console.log('👁️ ID de la multa:', multa.id_multa);
            
            // Obtener datos frescos de la multa por ID
            const multaData = await obtenerMultaPorId(multa.id_multa);
            console.log('👁️ Datos obtenidos para el modal:', multaData);
            
            setMultaSeleccionada(multaData);
            setMostrarDetallesModal(true);
        } catch (error) {
            console.error('❌ Error al obtener los detalles de la multa:', error);
            alert('Error al obtener los detalles de la multa: ' + error.message);
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setMultaSeleccionada(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (multa) => {
        setMultaSeleccionada(multa);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };

    const handleCrearMulta = async (nuevaMulta) => {
        try {
            await crearMulta(nuevaMulta);
            await fetchMultas();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear la multa:', error);
            alert(`Error al crear la multa: ${error.message || error}`);
        }
    };

    const handleEditarMulta = async (datosEditados) => {
        try {
            await actualizarMulta(multaSeleccionada.id_multa, datosEditados);
            await fetchMultas();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar la multa:', error);
            alert(`Error al editar la multa: ${error.message || error}`);
        }
    };

    const handleEliminarMulta = async () => {
        try {
            console.log(`Intentando eliminar la multa con ID: ${multaSeleccionada.id_multa}`);
            await eliminarMulta(multaSeleccionada.id_multa);
            console.log('Multa eliminada correctamente');
            await fetchMultas();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar la multa:', error);
            alert(`Error al eliminar la multa: ${error.message || error}`);
        }
    };

    return (
        <div className="multas-container" style={{
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
            <h1 className="multas-title" style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '32px',
                color: '#222',
                width: '100%',
                padding: '0 20px'
            }}>Gestión de Multas</h1>
            <div className="multas-table-wrapper" style={{
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
                <table className="multas-table" style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    backgroundColor: 'white',
                    color: '#333',
                    tableLayout: 'fixed'
                }}>
                    <thead style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: '10',
                        width: 'calc(100% - 8px)',
                        display: 'table',
                        tableLayout: 'fixed'
                    }}>
                        <tr>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopLeftRadius: '8px',
                                paddingLeft: '20px'
                            }}>ID</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>ID Préstamo</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Monto</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Estado</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'right',
                                borderBottom: '2px solid #f0f0f0',
                                borderTopRightRadius: '8px',
                                paddingRight: '35px'
                            }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody style={{
                        display: 'block',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '350px',
                        width: '100%'
                    }}>
                        {multas.map((multa) => (
                            <tr 
                                key={multa.id_multa} 
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
                                }}>{multa.id_multa}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{multa.id_prestamo}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{"₡"}{parseFloat(multa.monto || 0).toFixed(2)}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: multa.pagado === 1 ? '#d4edda' : '#f8d7da',
                                        color: multa.pagado === 1 ? '#155724' : '#721c24'
                                    }}>
                                        {multa.pagado === 1 ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #dddddd',
                                    paddingRight: '10px'
                                }}>
                                    <button 
                                        className="multas-button" 
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
                                        onClick={() => handleVerMulta(multa)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {multas.length === 0 && (
                            <tr style={{
                                display: 'table',
                                width: 'calc(100% - 8px)',
                                tableLayout: 'fixed'
                            }}>
                                <td colSpan="5" style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>
                                    No hay multas para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="crear-multa-container" style={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
                margin: '20px auto 0 auto'
            }}>
                <button 
                    className="crear-multa-button" 
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
            
            {mostrarDetallesModal && multaSeleccionada && (
                <MultaDetailsModal
                    multa={multaSeleccionada}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarMulta}
                    onDelete={handleEliminarMulta}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreateMulta
                    onClose={cerrarCrearModal}
                    onSave={handleCrearMulta}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && multaSeleccionada && (
                <DeleteMultaModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarMulta}
                    multa={multaSeleccionada}
                />
            )}
        </div>
    );
}

export default MultasPage;

import React, { useEffect, useState } from 'react';
import { obtenerLectores, obtenerLectorPorId, actualizarLector, eliminarLector, crearLector } from '../../services/lectoresService';
import LectorDetailsModal from '../modals/LectorDetailsModal';
import EditCreateLector from '../modals/EditCreateLector';
import DeleteLectorModal from '../modals/DeleteLectorModal';
import './lectores.css';

function LectoresPage() {
    const [lectores, setLectores] = useState([]);
    const [lectorSeleccionado, setLectorSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchLectores = async () => {
        try {
            const data = await obtenerLectores();
            setLectores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener lectores:', error);
            setLectores([]);
        }
    };

    useEffect(() => {
        fetchLectores();
    }, []);    const handleVerLector = async (lector) => {
        try {
            console.log('👁️ Haciendo clic en Ver lector:', lector);
            console.log('👁️ ID del lector:', lector.id_lector);
            
            // Obtener datos frescos del lector por ID
            const lectorData = await obtenerLectorPorId(lector.id_lector);
            console.log('👁️ Datos obtenidos para el modal:', lectorData);
            
            setLectorSeleccionado(lectorData);
            setMostrarDetallesModal(true);
        } catch (error) {
            console.error('❌ Error al obtener los detalles del lector:', error);
            alert('Error al obtener los detalles del lector: ' + error.message);
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setLectorSeleccionado(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (lector) => {
        setLectorSeleccionado(lector);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };

    const handleCrearLector = async (nuevoLector) => {
        try {
            await crearLector(nuevoLector);
            await fetchLectores();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear el lector:', error);
            alert(`Error al crear el lector: ${error.message || error}`);
        }
    };

    const handleEditarLector = async (datosEditados) => {
        try {
            await actualizarLector(lectorSeleccionado.id_lector, datosEditados);
            await fetchLectores();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar el lector:', error);
            alert(`Error al editar el lector: ${error.message || error}`);
        }
    };

    const handleEliminarLector = async () => {
        try {
            console.log(`Intentando eliminar el lector con ID: ${lectorSeleccionado.id_lector}`);
            await eliminarLector(lectorSeleccionado.id_lector);
            console.log('Lector eliminado correctamente');
            await fetchLectores();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar el lector:', error);
            alert(`Error al eliminar el lector: ${error.message || error}`);
        }
    };

    return (
        <div className="lectores-container" style={{
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
            <h1 className="lectores-title" style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '32px',
                color: '#222',
                width: '100%',
                padding: '0 20px'
            }}>Gestión de Lectores</h1>
            <div className="lectores-table-wrapper" style={{
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
                <table className="lectores-table" style={{
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
                            }}>Nombre</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Correo</th>
                            <th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Teléfono</th>
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
                        {lectores.map((lector) => (
                            <tr 
                                key={lector.id_lector} 
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
                                }}>{lector.id_lector}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{lector.nombre}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{lector.correo}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{lector.telefono}</td>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #dddddd',
                                    paddingRight: '10px'
                                }}>
                                    <button 
                                        className="lectores-button" 
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
                                        onClick={() => handleVerLector(lector)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {lectores.length === 0 && (
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
                                    No hay lectores para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="crear-lector-container" style={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
                margin: '20px auto 0 auto'
            }}>
                <button 
                    className="crear-lector-button" 
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
            
            {mostrarDetallesModal && lectorSeleccionado && (
                <LectorDetailsModal
                    lector={lectorSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarLector}
                    onDelete={handleEliminarLector}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreateLector
                    onClose={cerrarCrearModal}
                    onSave={handleCrearLector}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && lectorSeleccionado && (
                <DeleteLectorModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarLector}
                    lector={lectorSeleccionado}
                />
            )}
        </div>
    );
}

export default LectoresPage;

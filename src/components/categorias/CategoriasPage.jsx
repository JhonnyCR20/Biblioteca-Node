import React, { useEffect, useState } from 'react';
import { obtenerGeneros, obtenerGeneroPorId, actualizarGenero, eliminarGenero, crearGenero } from '../../services/generosService';
import GeneroDetailsModal from '../modals/GeneroDetailsModal';
import EditCreateGenero from '../modals/EditCreateGenero';
import DeleteGeneroModal from '../modals/DeleteGeneroModal';
//import './categorias.css';

function CategoriasPage() {
    const [generos, setGeneros] = useState([]);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchGeneros = async () => {
        try {
            const data = await obtenerGeneros();
            setGeneros(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener géneros:', error);
            setGeneros([]);
        }
    };

    useEffect(() => {
        fetchGeneros();
    }, []);

    const handleVerGenero = async (genero) => {
        try {
            // Obtener datos frescos del género por ID
            const generoData = await obtenerGeneroPorId(genero.id_categoria);
            setGeneroSeleccionado(generoData);
            setMostrarDetallesModal(true);
        } catch (error) {
            alert('Error al obtener los detalles del género');
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setGeneroSeleccionado(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (genero) => {
        setGeneroSeleccionado(genero);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };

    const handleCrearGenero = async (nuevoGenero) => {
        try {
            await crearGenero(nuevoGenero);
            await fetchGeneros();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear el género:', error);
            alert(`Error al crear el género: ${error.message || error}`);
        }
    };

    const handleEditarGenero = async (datosEditados) => {
        try {
            await actualizarGenero(generoSeleccionado.id_categoria, datosEditados);
            await fetchGeneros();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar el género:', error);
            alert(`Error al editar el género: ${error.message || error}`);
        }
    };

    const handleEliminarGenero = async () => {
        try {
            console.log(`Intentando eliminar el género con ID: ${generoSeleccionado.id_categoria}`);
            await eliminarGenero(generoSeleccionado.id_categoria);
            console.log('Género eliminado correctamente');
            await fetchGeneros();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar el género:', error);
            alert(`Error al eliminar el género: ${error.message || error}`);
        }
    };    return (
        <div className="categorias-container" style={{
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
            <h1 className="categorias-title" style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '32px',
                color: '#222',
                width: '100%',
                padding: '0 20px'
            }}>Gestión de Categorías</h1>
            <div className="categorias-table-wrapper" style={{
                width: '70%',
                maxWidth: '100%',
                background: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                margin: '20px auto 0 auto',
                paddingBottom: '0',
                boxSizing: 'border-box',
                position: 'relative',                height: '400px'
            }}>
                <table className="categorias-table" style={{
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
                            }}>Nombre</th><th style={{
                                backgroundColor: '#f0f4f8',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '15px',
                                textAlign: 'left',
                                borderBottom: '2px solid #f0f0f0'
                            }}>Descripción</th><th style={{
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
                    }}>{generos.map((genero) => (
                            <tr 
                                key={genero.id_categoria} 
                                style={{
                                    display: 'table',
                                    width: 'calc(100% - 8px)',
                                    tableLayout: 'fixed'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                }}                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}>
                                <td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    paddingLeft: '20px',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{genero.id_categoria}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{genero.nombre}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dddddd',
                                    color: '#333'
                                }}>{genero.descripcion || 'Sin descripción'}</td><td style={{
                                    padding: '15px',
                                    textAlign: 'right',
                                    borderBottom: '1px solid #dddddd',
                                    paddingRight: '10px'
                                }}>
                                    <button 
                                        className="categorias-button" 
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
                                        }}                                        onClick={() => handleVerGenero(genero)}                                    >
                                        Ver</button>
                                </td></tr>
                        ))}{generos.length === 0 && (
                            <tr style={{
                                display: 'table',
                                width: 'calc(100% - 8px)',
                                tableLayout: 'fixed'
                            }}>
                                <td colSpan="4" style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    borderBottom: '1px solid #dddddd',                                    color: '#333'                                }}>
                                    No hay categorías para mostrar.</td></tr>
                        )}</tbody></table>
            </div>
            <div className="crear-categoria-container" style={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
                margin: '20px auto 0 auto'
            }}>
                <button 
                    className="crear-categoria-button" 
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
                    }}                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                    }}
                    onClick={() => setMostrarCrearModal(true)}
                >
                    Crear
                </button>
            </div>
            
            {mostrarDetallesModal && generoSeleccionado && (
                <GeneroDetailsModal
                    genero={generoSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarGenero}
                    onDelete={handleEliminarGenero}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreateGenero
                    onClose={cerrarCrearModal}
                    onSave={handleCrearGenero}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && generoSeleccionado && (
                <DeleteGeneroModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarGenero}
                    genero={generoSeleccionado}
                />
            )}
        </div>
    );
}

export default CategoriasPage;

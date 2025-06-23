import React, { useEffect, useState } from 'react';
import { obtenerEditoriales, obtenerEditorialPorId, actualizarEditorial, eliminarEditorial, crearEditorial } from '../../services/editorialesService';
import EditorialDetailsModal from '../modals/EditorialDetailsModal';
import EditCreateEditorial from '../modals/EditCreateEditorial';
import DeleteEditorialModal from '../modals/DeleteEditorialModal';
import './editoriales.css';

function EditorialesPage() {
    const [editoriales, setEditoriales] = useState([]);
    const [editorialSeleccionada, setEditorialSeleccionada] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchEditoriales = async () => {
        try {
            const data = await obtenerEditoriales();
            setEditoriales(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener editoriales:', error);
            setEditoriales([]);
        }
    };

    useEffect(() => {
        fetchEditoriales();
    }, []);

    // Debug: Mostrar datos en consola
    useEffect(() => {
        console.log('Editoriales:', editoriales);
    }, [editoriales]);

    const handleVerEditorial = async (editorial) => {
        try {
            // Obtener datos frescos de la editorial por ID
            const editorialData = await obtenerEditorialPorId(editorial.id_editorial);
            setEditorialSeleccionada(editorialData);
            setMostrarDetallesModal(true);
        } catch (error) {
            alert('Error al obtener los detalles de la editorial');
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setEditorialSeleccionada(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const abrirEliminarModal = (editorial) => {
        setEditorialSeleccionada(editorial);
        setMostrarEliminarModal(true);
    };

    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
    };

    const handleCrearEditorial = async (nuevaEditorial) => {
        try {
            await crearEditorial(nuevaEditorial);
            await fetchEditoriales();
            cerrarCrearModal();
        } catch (error) {
            console.error('Error al crear la editorial:', error);
            alert(`Error al crear la editorial: ${error.message || error}`);
        }
    };

    const handleEditarEditorial = async (datosEditados) => {
        try {
            await actualizarEditorial(editorialSeleccionada.id_editorial, datosEditados);
            await fetchEditoriales();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar la editorial:', error);
            alert(`Error al editar la editorial: ${error.message || error}`);
        }
    };

    const handleEliminarEditorial = async () => {
        try {
            console.log(`Intentando eliminar la editorial con ID: ${editorialSeleccionada.id_editorial}`);
            await eliminarEditorial(editorialSeleccionada.id_editorial);
            console.log('Editorial eliminada correctamente');
            await fetchEditoriales();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar la editorial:', error);
            alert(`Error al eliminar la editorial: ${error.message || error}`);
        }
    };    return (
        <div className="editoriales-container">
            <h1 className="editoriales-title">Gestión de Editoriales</h1>
            <div className="editoriales-table-wrapper">
                <table className="editoriales-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>País</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editoriales.map((editorial) => (
                            <tr key={editorial.id_editorial}>
                                <td>{editorial.id_editorial}</td>
                                <td>{editorial.nombre}</td>
                                <td>{editorial.pais}</td>
                                <td>
                                    <button className="editoriales-button" onClick={() => handleVerEditorial(editorial)}>Ver</button>
                                </td>
                            </tr>
                        ))}
                        {editoriales.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center'}}>
                                    No hay editoriales para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="crear-editorial-container">
                <button className="crear-editorial-button" onClick={() => setMostrarCrearModal(true)}>Crear</button>
            </div>
              {mostrarDetallesModal && editorialSeleccionada && (
                <EditorialDetailsModal
                    editorial={editorialSeleccionada}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarEditorial}
                    onDelete={handleEliminarEditorial}
                />
            )}
            
            {mostrarCrearModal && (
                <EditCreateEditorial
                    onClose={cerrarCrearModal}
                    onSave={handleCrearEditorial}
                    isEdit={false}
                />
            )}
            
            {mostrarEliminarModal && editorialSeleccionada && (
                <DeleteEditorialModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarEditorial}
                    editorial={editorialSeleccionada}
                />
            )}
        </div>
    );
}

export default EditorialesPage;

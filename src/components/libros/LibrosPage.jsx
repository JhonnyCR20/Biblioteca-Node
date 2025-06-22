import React, { useEffect, useState } from 'react';
import { obtenerLibros, obtenerLibroPorId, crearLibro, actualizarLibro, eliminarLibro } from '../../services/librosService';
import LibroDetailsModal from '../modals/LibroDetailsModal';
import EditCreateLibro from '../modals/EditCreateLibro';
import './libros.css';

function LibrosPage() {
    const [libros, setLibros] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);

    const fetchLibros = async () => {
        try {
            const data = await obtenerLibros();
            setLibros(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
            setLibros([]);
        }
    };

    useEffect(() => {
        fetchLibros();
    }, []);

    const handleVerLibro = async (libro) => {
        try {
            // Obtener datos frescos del libro por ID
            const libroData = await obtenerLibroPorId(libro.id_libro);
            setLibroSeleccionado(libroData);
            setMostrarDetallesModal(true);
        } catch (error) {
            alert('Error al obtener los detalles del libro');
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setLibroSeleccionado(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    const handleCrearLibro = async (nuevoLibro) => {
        try {
            await crearLibro(nuevoLibro);
            await fetchLibros();
            cerrarCrearModal();
        } catch (error) {
            alert('Error al crear el libro');
        }
    };

    const handleEditarLibro = async (datosEditados) => {
        try {
            await actualizarLibro(libroSeleccionado.id, datosEditados);
            await fetchLibros();
            cerrarDetallesModal();
        } catch (error) {
            alert('Error al editar el libro');
        }
    };

    const handleEliminarLibro = async () => {
        try {
            await eliminarLibro(libroSeleccionado.id);
            await fetchLibros();
            cerrarDetallesModal();
        } catch (error) {
            alert('Error al eliminar el libro');
        }
    };

    return (
        <div className="libros-container">
            <h1 className="libros-title">Gestión de Libros</h1>
            <div className="libros-table-wrapper">
                <table className="libros-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Año Publicación</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map((libro) => (
                            <tr key={libro.id_libro}>
                                <td>{libro.id_libro}</td>
                                <td>{libro.titulo}</td>
                                <td>{libro.autores && libro.autores.length > 0 ? libro.autores[0].nombre : ''}</td>
                                <td>{libro.anio_publicacion}</td>
                                <td>{libro.categoria_nombre}</td>
                                <td>
                                    <button className="libros-button" onClick={() => handleVerLibro(libro)}>Ver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="crear-libro-container">
                <button className="crear-libro-button" onClick={() => setMostrarCrearModal(true)}>Crear</button>
            </div>
            {mostrarCrearModal && (
                <EditCreateLibro
                    onClose={cerrarCrearModal}
                    onSave={handleCrearLibro}
                />
            )}
            {mostrarDetallesModal && (
                <LibroDetailsModal
                    libro={libroSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarLibro}
                    onDelete={handleEliminarLibro}
                />
            )}
        </div>
    );
}

export default LibrosPage;

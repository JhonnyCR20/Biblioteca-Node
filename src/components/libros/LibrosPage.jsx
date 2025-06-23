import React, { useEffect, useState } from 'react';
import { obtenerLibros, obtenerLibroPorId, actualizarLibro, eliminarLibro, crearLibro } from '../../services/librosService';
import { obtenerAutores } from '../../services/autoresService';
import LibroDetailsModal from '../modals/LibroDetailsModal';
import EditCreateLibro from '../modals/EditCreateLibro';
import './libros.css';

function LibrosPage() {
    const [libros, setLibros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);

    const fetchLibros = async () => {
        try {
            const data = await obtenerLibros();
            setLibros(Array.isArray(data) ? data : []);
        } catch (error) {
            setLibros([]);
        }
    };

    const fetchAutores = async () => {
        try {
            const data = await obtenerAutores();
            let autoresArr = [];
            if (Array.isArray(data.data)) {
                autoresArr = data.data;
            } else if (Array.isArray(data)) {
                autoresArr = data;
            } else if (data && Array.isArray(data.autores)) {
                autoresArr = data.autores;
            }
            setAutores(autoresArr);
        } catch (error) {
            setAutores([]);
        }
    };

    useEffect(() => {
        fetchLibros();
        fetchAutores();
    }, []);

    // Debug: Mostrar datos en consola
    useEffect(() => {
        console.log('Libros:', libros);
        console.log('Autores:', autores);
    }, [libros, autores]);

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
            // Incluye isbn con el valor original del libro seleccionado
            const libroPayload = {
                titulo: datosEditados.titulo,
                anio_publicacion: String(datosEditados.anio_publicacion).slice(0, 4), // Solo el año
                id_categoria: datosEditados.id_categoria,
                id_editorial: datosEditados.id_editorial,
                isbn: libroSeleccionado.isbn, // valor original, no editable
                cantidad_disponible: datosEditados.cantidad_disponible,
                autores: Array.isArray(datosEditados.autores)
                    ? datosEditados.autores.map(a => a.id_autor || a) // soporta objetos o ids
                    : [],
            };
            console.log('Payload enviado al editar libro:', libroPayload);
            await actualizarLibro(libroSeleccionado.id_libro, libroPayload);
            await fetchLibros();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar el libro:', error);
            alert('Error al editar el libro: ' + (error.message || error));
        }
    };

    const handleEliminarLibro = async () => {
        try {
            console.log(`Intentando eliminar el libro con ID: ${libroSeleccionado.id_libro}`);
            await eliminarLibro(libroSeleccionado.id_libro);
            console.log('Libro eliminado correctamente');
            await fetchLibros();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            alert(`Error al eliminar el libro: ${error.message || error}`);
        }
    };

    return (
        <div className="libros-container mt-4">
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
                        {libros.map((libro) => {
                            // Mostrar los nombres de los autores si existen
                            const autoresNombres = Array.isArray(libro.autores) && libro.autores.length > 0
                                ? libro.autores.map(a => a.nombre).join(', ')
                                : null;
                            return (
                                <tr key={libro.id_libro}>
                                    <td>{libro.id_libro}</td>
                                    <td>{libro.titulo}</td>
                                    <td>
                                        {autoresNombres ? (
                                            autoresNombres
                                        ) : (
                                            <span style={{color: 'red', fontWeight: 'bold'}}>
                                                Sin autor
                                            </span>
                                        )}
                                    </td>
                                    <td>{libro.anio_publicacion}</td>
                                    <td>{libro.categoria_nombre}</td>
                                    <td>
                                        <button className="libros-button" onClick={() => handleVerLibro(libro)}>Ver</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {autores.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{color: 'orange', fontWeight: 'bold', textAlign: 'center'}}>
                                    No hay autores cargados. Revisa la API de autores.
                                </td>
                            </tr>
                        )}
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
                    autoresGlobal={autores}
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

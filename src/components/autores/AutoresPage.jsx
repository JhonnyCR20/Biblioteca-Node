import React, { useEffect, useState } from 'react';
import { obtenerAutores, obtenerAutorPorId, crearAutor, editarAutor, eliminarAutor } from '../../services/autoresService';
import AuthorDetailsModal from '../modals/AuthorDetailsModal';
import EditCreateAuthor from '../modals/EditCreateAuthor';
import './autores.css';

function AutoresPage() {
    const [autores, setAutores] = useState([]);
    const [autorSeleccionado, setAutorSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);

    // Refresca la lista de autores
    const fetchAutores = async () => {
        try {
            const data = await obtenerAutores();
            setAutores(data);
        } catch (error) {
            console.error('Error al obtener los autores:', error);
        }
    };

    useEffect(() => {
        fetchAutores();
    }, []);

    const handleVerAutor = async (id) => {
        try {
            const autor = await obtenerAutorPorId(id);
            setAutorSeleccionado(autor);
            setMostrarDetallesModal(true);
        } catch (error) {
            console.error('Error al obtener el autor:', error);
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setAutorSeleccionado(null);
    };

    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
    };

    // Crear autor
    const handleCrearAutor = async (nuevoAutor) => {
        try {
            await crearAutor(nuevoAutor);
            await fetchAutores();
            cerrarCrearModal();
        } catch (error) {
            alert('Error al crear el autor');
        }
    };

    // Editar autor
    const handleEditarAutor = async (datosEditados) => {
        try {
            await editarAutor(autorSeleccionado.id_autor, datosEditados);
            await fetchAutores();
            cerrarDetallesModal();
        } catch (error) {
            alert('Error al editar el autor');
        }
    };

    // Eliminar autor
    const handleEliminarAutor = async () => {
        try {
            await eliminarAutor(autorSeleccionado.id_autor);
            await fetchAutores();
            cerrarDetallesModal();
        } catch (error) {
            alert('Error al eliminar el autor');
        }
    };    return (
        <div className="autores-container">
            <h1 className="autores-title">Gestión de Autores</h1>
            <div className="autores-table-wrapper">
                <table className="autores-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Nacionalidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autores.map((autor) => (
                            <tr key={autor.id_autor}>
                                <td>{autor.id_autor}</td>
                                <td>{autor.nombre}</td>
                                <td>{autor.nacionalidad}</td>
                                <td>
                                    <button className="autores-button" onClick={() => handleVerAutor(autor.id_autor)}>Ver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>            <div className="crear-autor">
                <button className="crear-autor-button" onClick={() => setMostrarCrearModal(true)}>Crear</button>
            </div>
            {mostrarCrearModal && (
                <EditCreateAuthor
                    onClose={cerrarCrearModal}
                    onSave={handleCrearAutor}
                />
            )}
            {mostrarDetallesModal && (
                <AuthorDetailsModal
                    autor={autorSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarAutor}
                    onDelete={handleEliminarAutor}
                />
            )}
        </div>
    );
}

export default AutoresPage;

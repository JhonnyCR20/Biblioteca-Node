import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario, crearUsuario } from '../../services/usuariosService';
import UsuarioDetailsModal from '../modals/UsuarioDetailsModal';
import DeleteUsuarioModal from '../modals/DeleteUsuarioModal';
import CrearUsuarioModal from '../modals/CrearUsuarioModal';
import EditCreateUsuario from '../modals/EditCreateUsuario';
import './usuarios.css';

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);
    const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
    const [mostrarEliminarModal, setMostrarEliminarModal] = useState(false);

    const fetchUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            console.log('Datos recibidos del servicio:', data);
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setUsuarios([]);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleVerUsuario = async (usuario) => {
        try {
            // Obtener datos frescos del usuario por ID
            const usuarioData = await obtenerUsuarioPorId(usuario.id_usuario);
            setUsuarioSeleccionado(usuarioData);
            setMostrarDetallesModal(true);
        } catch (error) {
            alert('Error al obtener los detalles del usuario');
        }
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setUsuarioSeleccionado(null);
    };    const cerrarCrearModal = () => {
        setMostrarCrearModal(false);
        setUsuarioSeleccionado(null);
    };

    const abrirCrearModal = () => {
        // Primero cerrar cualquier otro modal que pueda estar abierto
        setMostrarDetallesModal(false);
        setMostrarEliminarModal(false);
        
        // Limpiar selección de usuario completamente
        setUsuarioSeleccionado(null);
        
        // Pequeño delay para asegurar que React procese los cambios de estado
        setTimeout(() => {
            // Ahora sí abrir el modal de creación
            setMostrarCrearModal(true);
        }, 10);
    };

    const abrirEliminarModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setMostrarEliminarModal(true);
    };    const cerrarEliminarModal = () => {
        setMostrarEliminarModal(false);
        setUsuarioSeleccionado(null); // Limpiar usuario seleccionado
    };

    const handleCrearUsuario = async (nuevoUsuario) => {
        try {
            // Asegurarse de que no haya ID en la creación
            const datosLimpios = { ...nuevoUsuario };
            if (datosLimpios.id_usuario) delete datosLimpios.id_usuario;
            
            // Crear el usuario
            await crearUsuario(datosLimpios);
            
            // Actualizar lista y cerrar modal
            await fetchUsuarios();
            cerrarCrearModal();
            
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            alert(`Error al crear el usuario: ${error.message || error}`);
        }
    };

    const handleEditarUsuario = async (datosEditados) => {
        try {
            await actualizarUsuario(usuarioSeleccionado.id_usuario, datosEditados);
            await fetchUsuarios();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al editar el usuario:', error);
            alert(`Error al editar el usuario: ${error.message || error}`);
        }
    };

    const handleEliminarUsuario = async () => {
        try {
            console.log(`Intentando eliminar el usuario con ID: ${usuarioSeleccionado.id_usuario}`);
            await eliminarUsuario(usuarioSeleccionado.id_usuario);
            console.log('Usuario eliminado correctamente');
            await fetchUsuarios();
            cerrarEliminarModal();
            cerrarDetallesModal();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            alert(`Error al eliminar el usuario: ${error.message || error}`);
        }
    };    const formatearRol = (rol) => {
        return rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : '';
    };

    return (
        <div className="usuarios-container">
            <h1 className="usuarios-title">Gestión de Usuarios</h1>
            <div className="usuarios-table-wrapper">
                <table className="usuarios-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.correo}</td>
                                <td>{formatearRol(usuario.rol)}</td>
                                <td>
                                    <button className="usuarios-button" onClick={() => handleVerUsuario(usuario)}>Ver</button>
                                </td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>
                                    No hay usuarios para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>            <div className="crear-usuario-container">
                <button 
                    className="crear-usuario-button" 
                    onClick={() => {
                        console.log('=== CLIC EN BOTÓN CREAR ===');
                        console.log('Estado antes del clic:', {
                            usuarios: usuarios.length,
                            usuarioSeleccionado,
                            mostrarCrearModal
                        });
                        abrirCrearModal();
                    }}
                >
                    Crear
                </button>
            </div>

            {mostrarDetallesModal && usuarioSeleccionado && (
                <UsuarioDetailsModal
                    usuario={usuarioSeleccionado}
                    onClose={cerrarDetallesModal}
                    onEdit={handleEditarUsuario}
                    onDelete={handleEliminarUsuario}
                />
            )}
            
            {/* Modal completamente independiente para crear usuarios */}
            {mostrarCrearModal && (
                <CrearUsuarioModal
                    key={`crear-usuario-independiente-${Date.now()}`}
                    onClose={cerrarCrearModal}
                    onSave={handleCrearUsuario}
                />
            )}
            
            {mostrarEliminarModal && usuarioSeleccionado && (
                <DeleteUsuarioModal
                    onClose={cerrarEliminarModal}
                    onDelete={handleEliminarUsuario}
                    usuario={usuarioSeleccionado}
                />
            )}
        </div>
    );
}

export default UsuariosPage;

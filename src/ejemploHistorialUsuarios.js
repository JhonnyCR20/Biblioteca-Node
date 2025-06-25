// Ejemplo de uso del historial automático en el módulo de usuarios
import { crearHistorial } from '../../services/historialService';

// Ejemplo de uso en UsuariosPage.jsx
const handleCrearUsuario = async (nuevoUsuario) => {
    try {
        await crearUsuario(nuevoUsuario);
        
        // Registrar automáticamente en historial con fecha del cliente
        await crearHistorial(null, `Usuario creado: ${nuevoUsuario.nombre} (${nuevoUsuario.rol})`);
        
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
        
        // Registrar automáticamente en historial con fecha del cliente
        await crearHistorial(null, `Usuario actualizado: ${datosEditados.nombre} (ID: ${usuarioSeleccionado.id_usuario})`);
        
        await fetchUsuarios();
        cerrarDetallesModal();
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        alert(`Error al editar el usuario: ${error.message || error}`);
    }
};

const handleEliminarUsuario = async () => {
    try {
        const nombreUsuario = usuarioSeleccionado.nombre;
        await eliminarUsuario(usuarioSeleccionado.id_usuario);
        
        // Registrar automáticamente en historial con fecha del cliente
        await crearHistorial(null, `Usuario eliminado: ${nombreUsuario} (ID: ${usuarioSeleccionado.id_usuario})`);
        
        await fetchUsuarios();
        cerrarEliminarModal();
        cerrarDetallesModal();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert(`Error al eliminar el usuario: ${error.message || error}`);
    }
};

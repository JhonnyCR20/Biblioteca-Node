import { API_BASE_URL } from '../config';

export async function obtenerUsuarios() {
    const url = `${API_BASE_URL}/usuarios.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function crearUsuario(usuario) {
    // Asegurar que no se envíe ID en la creación
    const { id_usuario, ...usuarioSinId } = usuario;
    
    const response = await fetch(`${API_BASE_URL}/usuarios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioSinId),
    });
    if (!response.ok) {
        throw new Error('Error al crear el usuario');
    }
    return response.json();
}

export async function obtenerUsuarioPorId(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios.php/${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }
    const data = await response.json();
    return data.data ? data.data : data;
}

export async function actualizarUsuario(id, usuario) {
    const response = await fetch(`${API_BASE_URL}/usuarios.php/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
    }
    return response.json();
}

export async function eliminarUsuario(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios.php/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
    }
    return response.json();
}

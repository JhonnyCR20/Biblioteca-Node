import { API_BASE_URL } from '../config';

export async function obtenerEditoriales() {
    const url = `${API_BASE_URL}/editoriales.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener las editoriales');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function crearEditorial(editorial) {
    const response = await fetch(`${API_BASE_URL}/editoriales.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editorial),
    });
    if (!response.ok) {
        throw new Error('Error al crear la editorial');
    }
    return response.json();
}

export async function obtenerEditorialPorId(id) {
    const response = await fetch(`${API_BASE_URL}/editoriales.php?id=${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener la editorial');
    }
    const data = await response.json();
    return data.data ? data.data : data;
}

export async function actualizarEditorial(id, editorial) {
    const response = await fetch(`${API_BASE_URL}/editoriales.php?id=${id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editorial),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar la editorial');
    }
    return response.json();
}

export async function eliminarEditorial(id) {
    const response = await fetch(`${API_BASE_URL}/editoriales.php?id=${id}` , {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar la editorial');
    }
    return response.json();
}

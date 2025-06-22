import { API_BASE_URL } from '../config';

export async function obtenerAutores() {
    const url = `http://localhost/ProyectoApi/view/API/autores.php`;
    console.log('Fetching autores from URL:', url); // Debugging log
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los autores');
    }
    const data = await response.json();
    console.log('Response data:', data); // Debugging log
    return data;
}

export async function crearAutor(autor) {
    const response = await fetch(`${API_BASE_URL}/autores.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autor),
    });
    if (!response.ok) {
        throw new Error('Error al crear el autor');
    }
    return response.json();
}

export async function obtenerAutorPorId(id) {
    const response = await fetch(`${API_BASE_URL}/autores.php?id=${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener el autor');
    }
    return response.json();
}

export async function editarAutor(id, autor) {
    const response = await fetch(`${API_BASE_URL}/autores.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autor),
    });
    if (!response.ok) {
        throw new Error('Error al editar el autor');
    }
    return response.json();
}

export async function eliminarAutor(id) {
    const response = await fetch(`${API_BASE_URL}/autores.php?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el autor');
    }
    return response.json();
}

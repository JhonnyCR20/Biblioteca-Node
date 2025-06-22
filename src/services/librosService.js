import { API_BASE_URL } from '../config';

export async function obtenerLibros() {
    const url = `http://localhost/ProyectoApi/view/API/libros.php`;
    console.log('Fetching libros from URL:', url); // Debugging log
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los libros');
    }
    const data = await response.json();
    console.log('Response data:', data); // Debugging log
    return data.data; // <-- Solo el array de libros
}

export async function crearLibro(libro) {
    const response = await fetch(`${API_BASE_URL}/libros.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro),
    });
    if (!response.ok) {
        throw new Error('Error al crear el libro');
    }
    return response.json();
}

export async function obtenerLibroPorId(id) {
    // Usar la ruta tipo RESTful como en postman
    const response = await fetch(`${API_BASE_URL}/libros.php/${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener el libro');
    }
    const data = await response.json();
    return data.data ? data.data : data; // Por si el backend responde igual
}

export async function actualizarLibro(id, libro) {
    const response = await fetch(`${API_BASE_URL}/libros.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el libro');
    }
    return response.json();
}

export async function eliminarLibro(id) {
    const response = await fetch(`${API_BASE_URL}/libros.php?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el libro');
    }
    return response.json();
}

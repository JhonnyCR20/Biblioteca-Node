import { API_BASE_URL } from '../config';

export async function obtenerLibros() {
    const url = `${API_BASE_URL}/libros.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los libros');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function obtenerLectores() {
    const url = `${API_BASE_URL}/lectores.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los lectores');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

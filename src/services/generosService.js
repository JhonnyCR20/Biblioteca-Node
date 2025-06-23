import { API_BASE_URL } from '../config';

export async function obtenerGeneros() {
    const url = `${API_BASE_URL}/categorias.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los géneros');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function crearGenero(genero) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genero),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Categoría creada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Categoría creada' };
        }
    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error('Error al crear el género: ' + error.message);
    }
}

export async function obtenerGeneroPorId(id) {
    const response = await fetch(`${API_BASE_URL}/categorias.php/?id=${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener el género');
    }
    const data = await response.json();
    return data;
}

export async function actualizarGenero(id, genero) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias.php/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genero),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Categoría actualizada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Categoría actualizada' };
        }
    } catch (error) {
        console.error('Error al actualizar el género:', error);
        throw new Error('Error al actualizar el género: ' + error.message);
    }
}

export async function eliminarGenero(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias.php/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Categoría eliminada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Categoría eliminada' };
        }
    } catch (error) {
        console.error('Error al eliminar el género:', error);
        throw new Error('Error al eliminar el género: ' + error.message);
    }
}

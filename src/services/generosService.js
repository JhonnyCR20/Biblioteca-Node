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
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        let data = null;
        
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.warn('Respuesta no es JSON válido:', text);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return { status: 'success', message: 'Categoría eliminada' };
            }
        }
        
        // Si hay datos de respuesta, verificar el status
        if (data) {
            if (data.status === 'error') {
                // Crear error personalizado con información del backend
                const error = new Error(data.message);
                error.errorType = data.error_type;
                error.responseData = data;
                throw error;
            }
            return data;
        }
        
        // Si no hay datos pero la respuesta es exitosa
        if (response.ok) {
            return { status: 'success', message: 'Categoría eliminada' };
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Error al eliminar el género:', error);
        // Re-lanzar el error con la información original
        throw error;
    }
}

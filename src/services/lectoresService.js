import { API_BASE_URL } from '../config';

export async function obtenerLectores() {
    try {
        const url = `${API_BASE_URL}/lectores.php`;
        console.log('📋 Obteniendo lista de lectores...');
        console.log('🌐 URL:', url);
        
        const response = await fetch(url);
        console.log(`📡 Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Lectores obtenidos (raw):', data);
        
        // La API devuelve { status: "success", data: [...] }
        if (data.status === "success" && Array.isArray(data.data)) {
            console.log('📦 Retornando data.data:', data.data);
            return data.data;
        }
        
        // Fallback para otras estructuras
        const result = Array.isArray(data) ? data : (data.data || []);
        console.log('📦 Resultado fallback:', result);
        
        return result;
    } catch (error) {
        console.error('❌ Error al obtener lectores:', error);
        throw new Error('Error al obtener los lectores: ' + error.message);
    }
}

export async function crearLector(lector) {
    try {
        // Para crear, NO necesita ID en la URL
        const response = await fetch(`${API_BASE_URL}/lectores.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lector),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Lector creado' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Lector creado' };
        }
    } catch (error) {
        console.error('Error al crear el lector:', error);
        throw new Error('Error al crear el lector: ' + error.message);
    }
}

export async function obtenerLectorPorId(id) {
    try {
        const url = `${API_BASE_URL}/lectores.php/?id=${id}`;
        console.log(`🔍 Obteniendo lector con ID: ${id}`);
        console.log(`🌐 URL completa: ${url}`);
        
        const response = await fetch(url);
        console.log(`📡 Response status: ${response.status}`);
        console.log(`📡 Response ok: ${response.ok}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos del lector obtenidos (raw):', data);
        
        // La API devuelve { status: "success", data: {...} }
        if (data.status === "success" && data.data) {
            console.log('📦 Retornando data.data:', data.data);
            return data.data;
        }
        
        // Verificar si los datos son un array y tomar el primer elemento
        if (Array.isArray(data) && data.length > 0) {
            console.log('📦 Retornando primer elemento del array:', data[0]);
            return data[0];
        }
        
        console.log('📦 Retornando data directamente:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al obtener el lector:', error);
        throw new Error('Error al obtener el lector: ' + error.message);
    }
}

export async function actualizarLector(id, lector) {
    try {
        // Para actualizar, incluir el id_lector en el JSON según tu documentación
        const lectorConId = {
            ...lector,
            id_lector: parseInt(id)
        };
          const response = await fetch(`${API_BASE_URL}/lectores.php/?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lectorConId),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Lector actualizado' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Lector actualizado' };
        }
    } catch (error) {
        console.error('Error al actualizar el lector:', error);
        throw new Error('Error al actualizar el lector: ' + error.message);
    }
}

export async function eliminarLector(id) {
    try {        const response = await fetch(`${API_BASE_URL}/lectores.php/?id=${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Lector eliminado' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Lector eliminado' };
        }
    } catch (error) {
        console.error('Error al eliminar el lector:', error);
        throw new Error('Error al eliminar el lector: ' + error.message);
    }
}

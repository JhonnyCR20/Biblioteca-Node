import { API_BASE_URL } from '../config';

export async function obtenerMultas() {
    try {
        const url = `${API_BASE_URL}/multas.php`;
        console.log('📋 Obteniendo lista de multas...');
        console.log('🌐 URL:', url);
        
        const response = await fetch(url);
        console.log(`📡 Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Multas obtenidas (raw):', data);
        
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
        console.error('❌ Error al obtener multas:', error);
        throw new Error('Error al obtener las multas: ' + error.message);
    }
}

export async function crearMulta(multa) {
    try {
        // Para crear, NO necesita ID en la URL
        const response = await fetch(`${API_BASE_URL}/multas.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(multa),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Multa creada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Multa creada' };
        }
    } catch (error) {
        console.error('Error al crear la multa:', error);
        throw new Error('Error al crear la multa: ' + error.message);
    }
}

export async function obtenerMultaPorId(id) {
    try {
        const url = `${API_BASE_URL}/multas.php/${id}`;
        console.log(`🔍 Obteniendo multa con ID: ${id}`);
        console.log(`🌐 URL completa: ${url}`);
        
        const response = await fetch(url);
        console.log(`📡 Response status: ${response.status}`);
        console.log(`📡 Response ok: ${response.ok}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos de la multa obtenidos (raw):', data);
        
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
        console.error('❌ Error al obtener la multa:', error);
        throw new Error('Error al obtener la multa: ' + error.message);
    }
}

export async function actualizarMulta(id, multa) {
    try {
        const response = await fetch(`${API_BASE_URL}/multas.php/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(multa),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Multa actualizada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Multa actualizada' };
        }
    } catch (error) {
        console.error('Error al actualizar la multa:', error);
        throw new Error('Error al actualizar la multa: ' + error.message);
    }
}

export async function eliminarMulta(id) {
    try {        const response = await fetch(`${API_BASE_URL}/multas.php/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Multa eliminada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Multa eliminada' };
        }
    } catch (error) {
        console.error('Error al eliminar la multa:', error);
        throw new Error('Error al eliminar la multa: ' + error.message);
    }
}

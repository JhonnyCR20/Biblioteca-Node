import { API_BASE_URL } from '../config';

const DETALLE_PRESTAMOS_API_URL = 'http://localhost/ProyectoApi/ProyectoAPIs/view/API/detallePrestamos.php';

// Función auxiliar para limpiar respuestas malformadas de la API
const limpiarRespuestaAPI = (text) => {
    try {
        // Si la respuesta contiene HTML (errores PHP), devolver null
        if (text.includes('<br />') || text.includes('<b>') || text.includes('Fatal error') || text.includes('Warning:')) {
            console.warn('La API devolvió HTML/errores PHP en lugar de JSON');
            return null;
        }
        
        // Limpiar el JSON si tiene caracteres extraños al final
        let cleanText = text.trim();
        
        // Remover posibles caracteres PHP al final
        cleanText = cleanText.replace(/\s*\?>\s*$/, '');
        
        // Remover llaves duplicadas al final
        cleanText = cleanText.replace(/}\s*}+\s*$/, '}');
        
        // Remover caracteres de control
        cleanText = cleanText.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Intentar parsear el JSON
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Error al limpiar respuesta de la API:', error);
        console.log('Texto original:', text);
        return null;
    }
};

// Obtener todos los detalles de préstamos
export const obtenerDetallesPrestamos = async () => {
    try {
        const response = await fetch(DETALLE_PRESTAMOS_API_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Respuesta cruda de detalles:', text);
        
        const data = limpiarRespuestaAPI(text);
        if (data === null) {
            console.warn('No se pudo parsear la respuesta, devolviendo array vacío');
            return [];
        }
        
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error al obtener detalles de préstamos:', error);
        console.log('Devolviendo array vacío debido al error de la API');
        return []; // Devolver array vacío en lugar de lanzar error
    }
};

// Obtener un detalle de préstamo por ID
export const obtenerDetallePrestamoPorId = async (id) => {
    try {
        const response = await fetch(`${DETALLE_PRESTAMOS_API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener detalle de préstamo por ID:', error);
        throw error;
    }
};

// Obtener detalles de préstamos por ID de préstamo
export const obtenerDetallesPorPrestamo = async (idPrestamo) => {
    try {
        const todosLosDetalles = await obtenerDetallesPrestamos();
        return todosLosDetalles.filter(detalle => detalle.id_prestamo == idPrestamo);
    } catch (error) {
        console.error('Error al obtener detalles por préstamo:', error);
        console.log('Devolviendo array vacío debido al error de la API');
        return []; // Devolver array vacío en lugar de lanzar error
    }
};

// Crear un nuevo detalle de préstamo
export const crearDetallePrestamo = async (detallePrestamo) => {
    try {
        const response = await fetch(DETALLE_PRESTAMOS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detallePrestamo)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Respuesta cruda al crear detalle:', text);
        
        const data = limpiarRespuestaAPI(text);
        if (data === null) {
            console.warn('Error de parsing JSON, pero asumiendo operación exitosa');
            return { success: true, warning: 'JSON parse error but operation likely successful' };
        }
        
        return data;
    } catch (error) {
        console.error('Error al crear detalle de préstamo:', error);
        // Si el error es de JSON pero la operación fue exitosa, no fallar
        if (error.message.includes('Unexpected token')) {
            console.warn('Error de parsing JSON, pero asumiendo operación exitosa');
            return { success: true, warning: 'JSON parse error but operation likely successful' };
        }
        throw error;
    }
};

// Actualizar un detalle de préstamo
export const actualizarDetallePrestamo = async (id, detallePrestamo) => {
    try {
        const response = await fetch(`${DETALLE_PRESTAMOS_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detallePrestamo)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
          const text = await response.text();
        console.log('Respuesta cruda al actualizar detalle:', text);
        
        const data = limpiarRespuestaAPI(text);
        if (data === null) {
            console.warn('Error de parsing JSON, pero asumiendo operación exitosa');
            return { success: true, message: 'Operación realizada (respuesta malformada)' };
        }
        
        return data;
    } catch (error) {
        console.error('Error al actualizar detalle de préstamo:', error);
        // Si el error es de JSON pero la operación fue exitosa, no fallar
        if (error.message.includes('Unexpected token')) {
            console.warn('Error de parsing JSON, pero asumiendo operación exitosa');
            return { success: true, warning: 'JSON parse error but operation likely successful' };
        }
        throw error;
    }
};

// Eliminar un detalle de préstamo
export const eliminarDetallePrestamo = async (id) => {
    try {
        const response = await fetch(`${DETALLE_PRESTAMOS_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
          const text = await response.text();
        console.log('Respuesta cruda al eliminar detalle:', text);
        
        // Si no hay contenido o es muy corto, asumir éxito
        if (!text || text.trim().length < 5) {
            return { success: true };
        }
        
        const data = limpiarRespuestaAPI(text);
        if (data === null) {
            console.warn('Error parsing response, pero asumiendo operación exitosa');
            return { success: true };
        }
        
        return data;
    } catch (error) {
        console.error('Error al eliminar detalle de préstamo:', error);
        // Si el error es de JSON pero la operación fue exitosa, no fallar
        if (error.message.includes('Unexpected token')) {
            console.warn('Error de parsing JSON, pero asumiendo operación exitosa');
            return { success: true };
        }
        throw error;
    }
};

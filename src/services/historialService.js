import { API_BASE_URL } from '../config';

// Función para obtener todo el historial
export const obtenerHistorial = async () => {
    try {
        const url = `${API_BASE_URL}/historial.php`;
        console.log('Fetching historial from URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data);
        
        // Ajustar fechas automáticamente al recibirlas
        if (Array.isArray(data)) {
            return data.map(item => ({
                ...item,
                fecha: item.fecha // Mantenemos la fecha original
            }));
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener historial:', error);
        throw error;
    }
};

// Función para obtener historial por ID
export const obtenerHistorialPorId = async (id) => {
    try {
        const url = `${API_BASE_URL}/historial.php/${id}`;
        console.log('Fetching historial by ID from URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener historial por ID:', error);
        throw error;
    }
};

// Función para obtener la fecha y hora actual del navegador del usuario
export const obtenerFechaCliente = () => {
    const ahora = new Date();
    // Formatear como YYYY-MM-DD HH:MM:SS para PHP
    return ahora.getFullYear() + '-' + 
           String(ahora.getMonth() + 1).padStart(2, '0') + '-' + 
           String(ahora.getDate()).padStart(2, '0') + ' ' + 
           String(ahora.getHours()).padStart(2, '0') + ':' + 
           String(ahora.getMinutes()).padStart(2, '0') + ':' + 
           String(ahora.getSeconds()).padStart(2, '0');
};

// Función para crear un registro de historial con fecha del cliente (SIMPLE)
export const crearHistorial = async (idLector, accion) => {
    return await registrarAccionAutomatica(idLector, accion);
};

// Función AUTOMÁTICA para registrar en historial (usa fecha del navegador)
export const registrarAccionAutomatica = async (idLector, accion) => {
    try {
        const fechaCliente = obtenerFechaCliente();
        const url = `${API_BASE_URL}/historial.php`;
        
        const datos = {
            id_lector: idLector,
            accion: accion,
            fecha_cliente: fechaCliente
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
            console.warn('Error al registrar historial automático:', response.status);
            return false;
        }
        
        return await response.json();
    } catch (error) {
        console.warn('Error al registrar historial automático:', error);
        return false;
    }
};

import { API_BASE_URL } from '../config';

export async function obtenerReservas() {
    const url = `${API_BASE_URL}/reservas.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
}

export async function crearReserva(reserva) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Reserva creada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Reserva creada' };
        }
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        throw new Error('Error al crear la reserva: ' + error.message);
    }
}

export async function obtenerReservaPorId(id) {
    const response = await fetch(`${API_BASE_URL}/reservas.php?id=${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener la reserva');
    }
    const data = await response.json();
    console.log('Datos recibidos del servidor para reserva ID', id, ':', data);
    return data;
}

export async function actualizarReserva(id, reserva) {
    try {
        console.log('Actualizando reserva con ID:', id);
        console.log('Datos de la reserva:', reserva);
        
        const response = await fetch(`${API_BASE_URL}/reservas.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva),
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        console.log('Response text:', text);
        
        if (!text) {
            return { status: 'success', message: 'Reserva actualizada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Reserva actualizada' };
        }
    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        throw new Error('Error al actualizar la reserva: ' + error.message);
    }
}

export async function eliminarReserva(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas.php?id=${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido antes de intentar parsear JSON
        const text = await response.text();
        if (!text) {
            return { status: 'success', message: 'Reserva eliminada' };
        }
        
        try {
            return JSON.parse(text);
        } catch (jsonError) {
            console.warn('Respuesta no es JSON válido:', text);
            return { status: 'success', message: 'Reserva eliminada' };
        }
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        throw new Error('Error al eliminar la reserva: ' + error.message);
    }
}

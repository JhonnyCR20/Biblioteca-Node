const API_BASE_URL = 'http://localhost/ProyectoApi/ProyectoAPIs/view/API/prestamos.php';

import { 
    crearDetallePrestamo, 
    actualizarDetallePrestamo, 
    eliminarDetallePrestamo, 
    obtenerDetallesPorPrestamo 
} from './detallesPrestamosService';

// Obtener todos los préstamos
export const obtenerPrestamos = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        throw error;
    }
};

// Obtener un préstamo por ID
export const obtenerPrestamoPorId = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener préstamo por ID:', error);
        throw error;
    }
};

// Crear un nuevo préstamo
export const crearPrestamo = async (prestamo) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prestamo)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear préstamo:', error);
        throw error;
    }
};

// Actualizar un préstamo
export const actualizarPrestamo = async (id, prestamo) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prestamo)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar préstamo:', error);
        throw error;
    }
};

// Eliminar un préstamo
export const eliminarPrestamo = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
          return true;
    } catch (error) {
        console.error('Error al eliminar préstamo:', error);
        throw error;
    }
};

// Crear préstamo completo con sus detalles
export const crearPrestamoCompleto = async (datosPrestamo) => {
    try {
        // Separar los datos del préstamo de los libros
        const { libros, ...datosBasePrestamo } = datosPrestamo;
        
        // Crear el préstamo base
        const prestamoCreado = await crearPrestamo(datosBasePrestamo);
        
        // Si se creó correctamente y hay libros, crear los detalles
        if (prestamoCreado && libros && libros.length > 0) {
            const idPrestamo = prestamoCreado.id_prestamo || prestamoCreado.data?.id_prestamo;
            
            if (idPrestamo) {
                // Crear detalles para cada libro
                for (const libro of libros) {
                    await crearDetallePrestamo({
                        id_prestamo: idPrestamo,
                        id_libro: parseInt(libro.id_libro),
                        cantidad: libro.cantidad
                    });
                }
            }
        }
        
        return prestamoCreado;
    } catch (error) {
        console.error('Error al crear préstamo completo:', error);
        throw error;
    }
};

// Actualizar préstamo completo con sus detalles
export const actualizarPrestamoCompleto = async (id, datosPrestamo) => {
    try {
        // Separar los datos del préstamo de los libros
        const { libros, ...datosBasePrestamo } = datosPrestamo;
        
        // Actualizar el préstamo base
        const prestamoActualizado = await actualizarPrestamo(id, datosBasePrestamo);
        
        // Si hay libros para actualizar
        if (libros && libros.length > 0) {
            // Obtener detalles actuales
            const detallesActuales = await obtenerDetallesPorPrestamo(id);
            
            // Eliminar detalles existentes
            for (const detalle of detallesActuales) {
                await eliminarDetallePrestamo(detalle.id_detalle);
            }
            
            // Crear nuevos detalles
            for (const libro of libros) {
                await crearDetallePrestamo({
                    id_prestamo: id,
                    id_libro: parseInt(libro.id_libro),
                    cantidad: libro.cantidad
                });
            }
        }
        
        return prestamoActualizado;
    } catch (error) {
        console.error('Error al actualizar préstamo completo:', error);
        throw error;
    }
};

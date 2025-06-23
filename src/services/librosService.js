import { API_BASE_URL } from '../config';

export async function obtenerLibros() {
    const url = `${API_BASE_URL}/libros.php`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener los libros');
    }
    const data = await response.json();
    return data.data || [];
}

export async function crearLibro(libro) {
    const response = await fetch(`${API_BASE_URL}/libros.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro),
    });
    if (response.status < 200 || response.status >= 300) {
        let errorMsg = 'Error al crear el libro';
        try {
            const data = await response.json();
            errorMsg = data.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function obtenerLibroPorId(id) {
    const response = await fetch(`${API_BASE_URL}/libros.php/${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener el libro');
    }
    const data = await response.json();
    return data.data ? data.data : data;
}

export async function actualizarLibro(id, libro) {
    try {
        console.log(`Enviando petición a: ${API_BASE_URL}/libros.php/${id}`);
        const response = await fetch(`${API_BASE_URL}/libros.php/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(libro),
        });

        // Si la respuesta es exitosa pero no es JSON, consideramos que está bien
        // (podría ser un caso donde el backend no devuelve JSON pero sí actualizó correctamente)
        if (response.ok) {
            try {
                return await response.json();
            } catch (e) {
                console.warn('Respuesta no es JSON pero fue exitosa:', await response.text());
                return { success: true, message: 'Libro actualizado' };
            }
        }

        // Si no es exitosa, intentamos obtener el mensaje de error
        let errorMsg = `Error al actualizar el libro. Status: ${response.status}`;
        try {
            const data = await response.json();
            errorMsg = data.message || errorMsg;
        } catch (e) {
            // Si no es JSON, mostramos el texto del error
            try {
                const text = await response.text();
                errorMsg += ` - ${text.substring(0, 100)}...`;
            } catch {}
        }
        throw new Error(errorMsg);
    } catch (error) {
        console.error('Error en actualizarLibro:', error);
        throw error;
    }
}

export async function eliminarLibro(id) {
    try {
        console.log(`Enviando petición de eliminación a: ${API_BASE_URL}/libros.php/${id}`);
        const response = await fetch(`${API_BASE_URL}/libros.php/${id}`, {
            method: 'DELETE',
        });
        
        // Si la respuesta es exitosa pero no es JSON
        if (response.ok) {
            try {
                return await response.json();
            } catch (e) {
                console.warn('Respuesta no es JSON pero fue exitosa:', await response.text());
                return { success: true, message: 'Libro eliminado' };
            }
        }
        
        // Si no es exitosa, intentamos obtener el mensaje de error
        let errorMsg = `Error al eliminar el libro. Status: ${response.status}`;
        try {
            const data = await response.json();
            errorMsg = data.message || errorMsg;
        } catch (e) {
            // Si no es JSON, mostramos el texto del error
            try {
                const text = await response.text();
                errorMsg += ` - ${text.substring(0, 100)}...`;
            } catch {}
        }
        throw new Error(errorMsg);
    } catch (error) {
        console.error('Error en eliminarLibro:', error);
        throw error;
    }
}

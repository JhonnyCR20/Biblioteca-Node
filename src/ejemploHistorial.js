// Ejemplo de cómo usar el historial automático con fecha del cliente

import { crearHistorial } from './services/historialService';

// Ejemplos de uso súper simples:

// 1. Registrar acción de un lector específico
const registrarAccionLector = async () => {
    await crearHistorial(123, "Usuario consultó el catálogo");
};

// 2. Registrar acción administrativa (sin lector)
const registrarAccionAdmin = async () => {
    await crearHistorial(null, "Administrador creó nueva categoría");
};

// 3. Usar en un evento de botón
const handleClick = async () => {
    await crearHistorial(456, "Usuario realizó préstamo");
    // El historial se registra automáticamente con la fecha del navegador
};

// 4. Usar en cualquier componente React
const MiComponente = () => {
    const manejarAccion = async () => {
        // Una sola línea - automáticamente usa fecha del navegador del usuario
        await crearHistorial(789, "Usuario accedió a la sección de historial");
    };

    return <button onClick={manejarAccion}>Registrar Acción</button>;
};

export default MiComponente;

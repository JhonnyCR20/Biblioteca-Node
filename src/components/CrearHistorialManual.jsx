import React, { useState } from 'react';
import { crearHistorialManual, obtenerFechaCliente } from '../services/historialService';

const CrearHistorialManual = () => {
    const [idLector, setIdLector] = useState('');
    const [accion, setAccion] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje('');

        try {
            const datos = {
                id_lector: idLector ? parseInt(idLector) : null,
                accion: accion
                // fecha_cliente se agregará automáticamente
            };

            await crearHistorialManual(datos);
            setMensaje('✅ Historial creado exitosamente con fecha del navegador');
            setIdLector('');
            setAccion('');
        } catch (error) {
            setMensaje(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            maxWidth: '500px',
            margin: '20px auto'
        }}>
            <h3>Crear Historial Manual</h3>
            <p><strong>Fecha actual del navegador:</strong> {obtenerFechaCliente()}</p>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>ID Lector (opcional):</label>
                    <input
                        type="number"
                        value={idLector}
                        onChange={(e) => setIdLector(e.target.value)}
                        placeholder="Ej: 123 (dejar vacío para acciones administrativas)"
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Acción:</label>
                    <input
                        type="text"
                        value={accion}
                        onChange={(e) => setAccion(e.target.value)}
                        placeholder="Descripción de la acción realizada"
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !accion.trim()}
                    style={{
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Creando...' : 'Crear Historial con Fecha del Cliente'}
                </button>
            </form>

            {mensaje && (
                <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    borderRadius: '4px',
                    backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
                    color: mensaje.includes('✅') ? '#155724' : '#721c24'
                }}>
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default CrearHistorialManual;

import React, { useEffect, useState } from 'react';
import { obtenerHistorial } from '../../services/historialService';
import HistorialDetailsModal from '../modals/HistorialDetailsModal';
import './historial.css';

function HistorialPage() {
    const [historial, setHistorial] = useState([]);
    const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
    const [mostrarDetallesModal, setMostrarDetallesModal] = useState(false);

    const fetchHistorial = async () => {
        try {
            const data = await obtenerHistorial();
            setHistorial(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al obtener historial:', error);
            setHistorial([]);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    const handleVerEntrada = (entrada) => {
        setEntradaSeleccionada(entrada);
        setMostrarDetallesModal(true);
    };

    const cerrarDetallesModal = () => {
        setMostrarDetallesModal(false);
        setEntradaSeleccionada(null);
    };    const formatearFecha = (fecha) => {
        try {
            const fechaOriginal = new Date(fecha);
            // Restar un día para corregir la diferencia de zona horaria
            fechaOriginal.setDate(fechaOriginal.getDate() - 1);
            
            return fechaOriginal.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return fecha;
        }
    };const mostrarLector = (idLector) => {
        return idLector ? `Lector ${idLector}` : 'No aplica';
    };

    return (
        <div className="historial-container mt-4">
            <h1 className="historial-title">Historial de Actividades</h1>
            <div className="historial-table-wrapper">
                <table className="historial-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Lector</th>
                            <th>Acción</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.map((entrada) => (
                            <tr key={entrada.id_historial}>
                                <td>{entrada.id_historial}</td>
                                <td>{mostrarLector(entrada.id_lector)}</td>
                                <td className="accion-cell">{entrada.accion}</td>
                                <td>{formatearFecha(entrada.fecha)}</td>
                                <td>
                                    <button 
                                        className="historial-button" 
                                        onClick={() => handleVerEntrada(entrada)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {historial.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{color: 'orange', fontWeight: 'bold', textAlign: 'center'}}>
                                    No hay entradas de historial disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {mostrarDetallesModal && (
                <HistorialDetailsModal
                    entrada={entradaSeleccionada}
                    onClose={cerrarDetallesModal}
                />
            )}
        </div>
    );
}

export default HistorialPage;

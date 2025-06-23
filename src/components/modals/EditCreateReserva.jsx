import React, { useState, useRef, useEffect } from 'react';
import './css/EditCreateReserva.css';
import { obtenerLibros, obtenerLectores } from '../../services/datosService';

const EditCreateReserva = ({ initialData, onClose, onSave, isEdit = false }) => {
    // Función simple para convertir fecha del servidor (YYYY-MM-DD) al input date
    const convertirFechaParaInput = (fecha) => {
        if (!fecha) return '';
        // Si ya está en formato YYYY-MM-DD, devolverla tal como está
        if (typeof fecha === 'string' && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return fecha;
        }
        return '';
    };    // Función simple para convertir fecha del input (YYYY-MM-DD) al servidor
    const convertirFechaParaServidor = (fecha) => {
        if (!fecha) return '';
        
        try {
            // Crear fecha y sumar un día para compensar el desfase
            const fechaObj = new Date(fecha + 'T00:00:00'); // Asegurar hora local
            fechaObj.setDate(fechaObj.getDate() + 1); // Sumar un día
            
            // Convertir de vuelta a formato YYYY-MM-DD
            const year = fechaObj.getFullYear();
            const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const day = String(fechaObj.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error al ajustar fecha:', error);
            return fecha; // Devolver la fecha original si hay error
        }
    };

    const [formData, setFormData] = useState({
        id_libro: initialData?.id_libro || '',
        id_lector: initialData?.id_lector || '',
        fecha_reserva: convertirFechaParaInput(initialData?.fecha_reserva) || '',
        estado: initialData?.estado || 'Activa',
    });
    
    const [errors, setErrors] = useState({});
    const [libros, setLibros] = useState([]);
    const [lectores, setLectores] = useState([]);
    const [loading, setLoading] = useState(true);    const modalRef = useRef(null);    // Actualizar formData cuando cambie initialData
    useEffect(() => {
        if (initialData && isEdit) {
            setFormData({
                id_libro: initialData.id_libro || '',
                id_lector: initialData.id_lector || '',
                fecha_reserva: convertirFechaParaInput(initialData.fecha_reserva) || '',
                estado: initialData.estado || 'Activa',
            });
        }
    }, [initialData, isEdit]);
    
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [librosData, lectoresData] = await Promise.all([
                    obtenerLibros(),
                    obtenerLectores()
                ]);
                setLibros(librosData);
                setLectores(lectoresData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar libros y lectores');
            } finally {
                setLoading(false);
            }
        };
        
        cargarDatos();
    }, []);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
      const validateForm = () => {
        const newErrors = {};
        if (!formData.id_libro) newErrors.id_libro = 'Debe seleccionar un libro';
        if (!formData.id_lector) newErrors.id_lector = 'Debe seleccionar un lector';
        if (!formData.fecha_reserva.trim()) newErrors.fecha_reserva = 'La fecha de reserva es obligatoria';
        if (!formData.estado.trim()) newErrors.estado = 'El estado es obligatorio';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error cuando se modifica el campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convertir los IDs a números y manejar la fecha
            const dataToSend = {
                ...formData,
                id_libro: parseInt(formData.id_libro),
                id_lector: parseInt(formData.id_lector),
                fecha_reserva: convertirFechaParaServidor(formData.fecha_reserva)
            };
            onSave(dataToSend);
        }
    };

    return (
        <div className="edit-create-reserva-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-reserva-content">
                <div className="edit-create-reserva-header">
                    <h2>{isEdit ? 'Editar Reserva' : 'Crear Reserva'}</h2>
                </div>
                  <form onSubmit={handleSubmit} className="edit-create-reserva-form">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Cargando datos...
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="id_libro">Libro:</label>
                                <select
                                    id="id_libro"
                                    name="id_libro"
                                    value={formData.id_libro}
                                    onChange={handleChange}
                                    className={errors.id_libro ? 'error' : 'form-control'}
                                >
                                    <option value="">Seleccionar libro...</option>
                                    {libros.map((libro) => (
                                        <option key={libro.id_libro} value={libro.id_libro}>
                                            {libro.titulo}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_libro && <div className="error-message">{errors.id_libro}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="id_lector">Lector:</label>
                                <select
                                    id="id_lector"
                                    name="id_lector"
                                    value={formData.id_lector}
                                    onChange={handleChange}
                                    className={errors.id_lector ? 'error' : 'form-control'}
                                >
                                    <option value="">Seleccionar lector...</option>
                                    {lectores.map((lector) => (
                                        <option key={lector.id_lector} value={lector.id_lector}>
                                            {lector.nombre} {lector.apellido}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_lector && <div className="error-message">{errors.id_lector}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="fecha_reserva">Fecha de Reserva:</label>
                                <input
                                    type="date"
                                    id="fecha_reserva"
                                    name="fecha_reserva"
                                    value={formData.fecha_reserva}
                                    onChange={handleChange}
                                    className={errors.fecha_reserva ? 'error' : 'form-control'}
                                />
                                {errors.fecha_reserva && <div className="error-message">{errors.fecha_reserva}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="estado">Estado:</label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className={errors.estado ? 'error' : 'form-control'}                                >
                                    <option value="Seleccione">Seleccione</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Completada">Completada</option>
                                    <option value="Expirada">Expirada</option>
                                    <option value="Pendiente">Pendiente</option>
                                </select>
                                {errors.estado && <div className="error-message">{errors.estado}</div>}
                            </div>
                        </>
                    )}
                      <div className="edit-create-reserva-actions">
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Cargando...' : 'Guardar'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateReserva;

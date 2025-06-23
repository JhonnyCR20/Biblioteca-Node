import React, { useState, useRef, useEffect } from 'react';
import './EditCreateReserva.css';
import { obtenerLibros, obtenerLectores } from '../../services/datosService';

const EditCreateReserva = ({ initialData, onClose, onSave, isEdit = false }) => {    // Función para formatear fecha para input date
    const formatearFechaParaInput = (fecha) => {
        if (!fecha) return '';
        
        // Si la fecha viene en formato 'YYYY-MM-DD', la usamos directamente
        if (typeof fecha === 'string' && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return fecha;
        }
        
        // Si la fecha viene en formato DD/MM/YYYY (como se muestra en la tabla)
        if (typeof fecha === 'string' && fecha.includes('/')) {
            const [day, month, year] = fecha.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        // Para otros formatos, convertir evitando problemas de zona horaria
        try {
            // Crear fecha en hora local para evitar desfases de zona horaria
            const fechaStr = fecha.toString();
            const fechaObj = new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T00:00:00'));
            
            const year = fechaObj.getFullYear();
            const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const day = String(fechaObj.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '';
        }
    };const [formData, setFormData] = useState({
        id_libro: initialData?.id_libro || '',
        id_lector: initialData?.id_lector || '',
        fecha_reserva: formatearFechaParaInput(initialData?.fecha_reserva) || '',
        estado: initialData?.estado || 'Activa',
    });
    
    const [errors, setErrors] = useState({});
    const [libros, setLibros] = useState([]);
    const [lectores, setLectores] = useState([]);
    const [loading, setLoading] = useState(true);    const modalRef = useRef(null);    // Actualizar formData cuando cambie initialData
    useEffect(() => {        if (initialData && isEdit) {
            console.log('Initial data recibida:', initialData);
            console.log('Estado inicial:', initialData.estado);
            console.log('Fecha original en initialData:', initialData.fecha_reserva);
            
            const fechaFormateada = formatearFechaParaInput(initialData.fecha_reserva);
            console.log('Fecha formateada para input:', fechaFormateada);
            
            const newFormData = {
                id_libro: initialData.id_libro || '',
                id_lector: initialData.id_lector || '',
                fecha_reserva: fechaFormateada,
                estado: initialData.estado || 'Activa',
            };
            console.log('Form data establecido:', newFormData);
            console.log('Estado en form data:', newFormData.estado);
            setFormData(newFormData);
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
    };
      const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Campo ${name} cambiado a:`, value);
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };
            console.log('Nuevo formData:', newData);
            return newData;
        });
        
        // Limpiar error cuando se modifica el campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convertir los IDs a números
            const dataToSend = {
                ...formData,
                id_libro: parseInt(formData.id_libro),
                id_lector: parseInt(formData.id_lector)
            };
            console.log('Datos del formulario a enviar:', dataToSend);
            console.log('Es modo edición:', isEdit);
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
                                    <option value="Activa">Activa</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Completada">Completada</option>
                                    <option value="Expirada">Expirada</option>
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

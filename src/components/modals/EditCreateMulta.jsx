import React, { useState, useRef, useEffect } from 'react';
import './css/EditCreateMulta.css';

const EditCreateMulta = ({ initialData = null, onClose, onSave, isEdit = false }) => {
    const modalRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [prestamos, setPrestamos] = useState([]);
      const [formData, setFormData] = useState({
        id_prestamo: initialData?.id_prestamo || '',
        monto: initialData?.monto || '',
        fecha_multa: initialData?.fecha_multa || new Date().toISOString().split('T')[0],
        pagado: initialData?.pagado || 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const cargarPrestamos = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost/ProyectoApi/ProyectoAPIs/view/API/prestamos.php');
                if (response.ok) {
                    const data = await response.json();
                    setPrestamos(Array.isArray(data) ? data : (data.data || []));
                }
            } catch (error) {
                console.error('Error al cargar préstamos:', error);
                setPrestamos([]);
            } finally {
                setLoading(false);
            }
        };
        
        cargarPrestamos();
    }, []);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
      const validateForm = () => {
        const newErrors = {};
        if (!formData.id_prestamo) newErrors.id_prestamo = 'Debe seleccionar un préstamo';
        if (!formData.monto.toString().trim()) newErrors.monto = 'El monto es obligatorio';
        if (parseFloat(formData.monto) <= 0) newErrors.monto = 'El monto debe ser mayor a 0';
        if (!formData.fecha_multa.trim()) newErrors.fecha_multa = 'La fecha de multa es obligatoria';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
        
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
          if (validateForm()) {
            const dataToSend = {
                ...formData,
                monto: parseFloat(formData.monto),
                id_prestamo: parseInt(formData.id_prestamo),
                descripcion: "Multa por retraso en devolución" // Descripción fija
            };
            
            onSave(dataToSend);
        }
    };

    return (
        <div className="edit-create-multa-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-multa-content">
                <div className="edit-create-multa-header">
                    <h2>{isEdit ? 'Editar Multa' : 'Crear Multa'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="edit-create-multa-form">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Cargando datos...
                        </div>
                    ) : (
                        <>
                            {/* Primera fila: Préstamo y Monto */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="id_prestamo">Préstamo:</label>
                                    <select
                                        id="id_prestamo"
                                        name="id_prestamo"
                                        value={formData.id_prestamo}
                                        onChange={handleChange}
                                        className={errors.id_prestamo ? 'error' : 'form-control'}
                                        disabled={isEdit} // No permitir cambiar el préstamo en edición
                                    >
                                        <option value="">Seleccionar préstamo...</option>
                                        {prestamos.map((prestamo) => (
                                            <option key={prestamo.id_prestamo} value={prestamo.id_prestamo}>
                                                Préstamo #{prestamo.id_prestamo} - Lector ID: {prestamo.id_lector}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_prestamo && <div className="error-message">{errors.id_prestamo}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="monto">Monto:</label>
                                    <input
                                        type="number"
                                        id="monto"
                                        name="monto"
                                        value={formData.monto}
                                        onChange={handleChange}
                                        className={errors.monto ? 'error' : 'form-control'}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                    {errors.monto && <div className="error-message">{errors.monto}</div>}
                                </div>
                            </div>

                            {/* Segunda fila: Fecha y Estado */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fecha_multa">Fecha de Multa:</label>
                                    <input
                                        type="date"
                                        id="fecha_multa"
                                        name="fecha_multa"
                                        value={formData.fecha_multa}
                                        onChange={handleChange}
                                        className={errors.fecha_multa ? 'error' : 'form-control'}
                                    />
                                    {errors.fecha_multa && <div className="error-message">{errors.fecha_multa}</div>}
                                </div>                                <div className="form-group">
                                    <label htmlFor="pagado">Pagado</label>
                                    <input
                                        type="checkbox"
                                        id="pagado"
                                        name="pagado"
                                        checked={formData.pagado === 1}
                                        onChange={handleChange}
                                        className="checkbox-input"
                                    />
                                </div>                            </div>
                            
                            {/* Tercera fila: Botones */}                            <div className="edit-create-multa-actions">
                                <button type="submit" className="edit-create-multa-save-button">
                                    Guardar
                                </button>
                                <button type="button" onClick={onClose} className="edit-create-multa-cancel-button">
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditCreateMulta;

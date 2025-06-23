import React, { useState, useRef } from 'react';
import './css/EditCreateLector.css';

const EditCreateLector = ({ initialData, onClose, onSave, isEdit = false }) => {    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        correo: initialData?.correo || '',
        telefono: initialData?.telefono || '',
        direccion: initialData?.direccion || '',
    });
    
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'El correo no tiene un formato válido';
        }
        
        // Validar teléfono si se proporciona
        if (formData.telefono && !/^\d{4}-\d{4}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener el formato XXXX-XXXX';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si es el campo telefono, solo permitir números y guiones
        if (name === 'telefono') {
            // Permitir solo números y el formato XXXX-XXXX
            const numericValue = value.replace(/\D/g, ''); // Remover todo lo que no sea dígito
            let formattedValue = numericValue;
            
            // Aplicar formato XXXX-XXXX automáticamente
            if (numericValue.length >= 4) {
                formattedValue = numericValue.slice(0, 4) + '-' + numericValue.slice(4, 8);
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
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
            // Preparar datos para enviar, removiendo campos vacíos opcionales
            const dataToSend = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim(),
            };
            
            // Solo agregar campos opcionales si tienen valor
            if (formData.telefono.trim()) {
                dataToSend.telefono = formData.telefono.trim();
            }
            
            if (formData.direccion.trim()) {
                dataToSend.direccion = formData.direccion.trim();
            }
            
            onSave(dataToSend);
        }
    };

    return (
        <div className="edit-create-lector-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-lector-content">
                <div className="edit-create-lector-header">
                    <h2>{isEdit ? 'Editar Lector' : 'Crear Lector'}</h2>
                </div>                <form onSubmit={handleSubmit} className="edit-create-lector-form">
                    {/* Primera fila: Nombre y Correo */}
                    <div className="form-row">                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'error' : 'form-control'}
                                placeholder="Ingrese el nombre completo"
                                maxLength="35"
                            />
                            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="correo">Correo:</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={errors.correo ? 'error' : 'form-control'}
                                placeholder="Ingrese el correo electrónico"
                            />
                            {errors.correo && <div className="error-message">{errors.correo}</div>}
                        </div>
                    </div>
                    
                    {/* Segunda fila: Teléfono y Dirección */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono (opcional):</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={errors.telefono ? 'error' : 'form-control'}
                                placeholder="XXXX-XXXX"
                                maxLength="9"
                            />
                            {errors.telefono && <div className="error-message">{errors.telefono}</div>}
                        </div>
                          <div className="form-group">
                            <label htmlFor="direccion">Dirección (opcional):</label>
                            <textarea
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese la dirección"
                                maxLength="35"
                                rows="3"
                            />
                            <small style={{ color: '#666', fontSize: '12px' }}>
                                {formData.direccion.length}/35 caracteres
                            </small>
                        </div>
                    </div>
                    
                    {/* Tercera fila: Botones */}
                    <div className="edit-create-lector-actions">
                        <button type="submit" className="save-button">
                            Guardar
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateLector;

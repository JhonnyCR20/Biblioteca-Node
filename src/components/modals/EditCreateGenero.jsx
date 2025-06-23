import React, { useState, useRef } from 'react';
import './css/EditCreateGenero.css';

const EditCreateGenero = ({ initialData, onClose, onSave, isEdit = false }) => {    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        descripcion: initialData?.descripcion || '',
    });
    
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);
    
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e) => {
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
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };
      return (
        <div className="edit-create-genero-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-genero-content">
                <div className="edit-create-genero-header">
                    <h2>{isEdit ? 'Editar Categoría' : 'Crear Categoría'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="edit-create-genero-form">                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? 'error' : 'form-control'}
                            maxLength="35"
                        />
                        {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            placeholder="Descripción de la categoría (opcional)"
                            maxLength="35"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            {formData.descripcion.length}/35 caracteres
                        </small>
                    </div>
                    
                    <div className="edit-create-genero-actions">
                        <button type="submit" className="save-button">Guardar</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateGenero;

import React, { useState, useRef } from 'react';
import './EditCreateEditorial.css';

const EditCreateEditorial = ({ initialData, onClose, onSave, isEdit = false }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        pais: initialData?.pais || '',
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
        if (!formData.pais.trim()) newErrors.pais = 'El país es obligatorio';
        
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
        <div className="edit-create-editorial-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-editorial-content">
                <div className="edit-create-editorial-header">
                    <h2>{isEdit ? 'Editar Editorial' : 'Crear Editorial'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="edit-create-editorial-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={errors.nombre ? 'error' : 'form-control'}
                        />
                        {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="pais">País:</label>
                        <input
                            type="text"
                            id="pais"
                            name="pais"
                            value={formData.pais}
                            onChange={handleChange}
                            className={errors.pais ? 'error' : 'form-control'}
                        />
                        {errors.pais && <div className="error-message">{errors.pais}</div>}
                    </div>
                    
                    <div className="edit-create-editorial-actions">
                        <button type="submit" className="save-button">Guardar</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateEditorial;

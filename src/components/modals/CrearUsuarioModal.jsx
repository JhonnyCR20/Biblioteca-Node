import React, { useState, useRef } from 'react';
import './css/CrearUsuarioModal.css';

const CrearUsuarioModal = ({ onClose, onSave }) => {
    // Generar IDs únicos para evitar autocompletado del navegador
    const uniqueId = Math.random().toString(36).substr(2, 9);
    
    // Estado completamente independiente, sin initialData
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        rol: 'lector',
        password: ''
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
        
        // Validar nombre (solo letras y espacios)
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (formData.nombre.trim().length > 30) {
            newErrors.nombre = 'El nombre no puede exceder 30 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
            newErrors.nombre = 'El nombre solo puede contener letras y espacios';
        }
        
        // Validar correo
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
            newErrors.correo = 'El correo no tiene un formato válido';
        }
        
        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        // Validar rol
        if (!['admin', 'bibliotecario', 'lector'].includes(formData.rol)) {
            newErrors.rol = 'Debe seleccionar un rol válido';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si es el campo nombre, filtrar solo letras y espacios
        if (name === 'nombre') {
            // Permitir solo letras, espacios y caracteres acentuados
            const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: filteredValue
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Preparar datos para enviar (convertir password a clave para el backend)
            const dataToSend = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim(),
                rol: formData.rol,
                clave: formData.password
            };
            
            onSave(dataToSend);
        }
    };

    return (
        <div className="crear-usuario-modal-overlay" ref={modalRef} onClick={handleBackdropClick}>
            <div className="crear-usuario-modal-content">
                <div className="crear-usuario-modal-header">
                    <h2>Crear Usuario</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="crear-usuario-form" autoComplete="off">
                    {/* Primera fila: Nombre y Correo */}
                    <div className="crear-usuario-form-row">
                        <div className="crear-usuario-form-group">
                            <label htmlFor={`nombre-${uniqueId}`}>Nombre:</label>
                            <input
                                type="text"
                                id={`nombre-${uniqueId}`}
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'crear-usuario-input error' : 'crear-usuario-input'}
                                placeholder="Ingrese el nombre completo"
                                maxLength="30"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.nombre && <div className="crear-usuario-error">{errors.nombre}</div>}
                        </div>
                        
                        <div className="crear-usuario-form-group">
                            <label htmlFor={`correo-${uniqueId}`}>Correo:</label>
                            <input
                                type="email"
                                id={`correo-${uniqueId}`}
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={errors.correo ? 'crear-usuario-input error' : 'crear-usuario-input'}
                                placeholder="Ingrese el correo electrónico"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.correo && <div className="crear-usuario-error">{errors.correo}</div>}
                        </div>
                    </div>
                    
                    {/* Segunda fila: Contraseña y Rol */}
                    <div className="crear-usuario-form-row">
                        <div className="crear-usuario-form-group">
                            <label htmlFor={`password-${uniqueId}`}>Contraseña:</label>
                            <input
                                type="password"
                                id={`password-${uniqueId}`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'crear-usuario-input error' : 'crear-usuario-input'}
                                placeholder="Ingrese la contraseña"
                                minLength="6"
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.password && <div className="crear-usuario-error">{errors.password}</div>}
                        </div>
                        
                        <div className="crear-usuario-form-group">
                            <label htmlFor={`rol-${uniqueId}`}>Rol:</label>
                            <select
                                id={`rol-${uniqueId}`}
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className={errors.rol ? 'crear-usuario-input error' : 'crear-usuario-input'}
                                autoComplete="off"
                            >
                                <option value="lector">Lector</option>
                                <option value="bibliotecario">Bibliotecario</option>
                                <option value="admin">Administrador</option>
                            </select>
                            {errors.rol && <div className="crear-usuario-error">{errors.rol}</div>}
                        </div>
                    </div>
                    
                    {/* Tercera fila: Botones */}
                    <div className="crear-usuario-actions">
                        <button type="submit" className="crear-usuario-save-btn">
                            Crear
                        </button>
                        <button type="button" onClick={onClose} className="crear-usuario-cancel-btn">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearUsuarioModal;

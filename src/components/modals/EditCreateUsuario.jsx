import React, { useState, useRef, useEffect } from 'react';
import './css/EditCreateUsuario.css';

const EditCreateUsuario = ({ initialData, onClose, onSave, isEdit = false }) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        correo: initialData?.correo || '',
        rol: initialData?.rol || 'lector',
        password: ''
    });
    
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    // Resetear el formulario cuando initialData cambie
    useEffect(() => {
        const newFormData = {
            nombre: initialData?.nombre || '',
            correo: initialData?.correo || '',
            rol: initialData?.rol || 'lector',
            password: ''
        };
        
        setFormData(newFormData);
        setErrors({}); // Limpiar errores también
    }, [initialData]);

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
        
        // Validar rol
        if (!['admin', 'bibliotecario', 'lector'].includes(formData.rol)) {
            newErrors.rol = 'Debe seleccionar un rol válido';
        }
        
        // Validar contraseña (solo si es crear o si se está cambiando)
        if (!isEdit || formData.password) {
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
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
            // Preparar datos para enviar
            const dataToSend = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim(),
                rol: formData.rol
            };
            
            // Solo incluir contraseña si se proporcionó (crear o cambiar)
            // Convertir password a clave para el backend
            if (formData.password) {
                dataToSend.clave = formData.password;
            }
            
            onSave(dataToSend);
        }
    };

    return (
        <div className="usuario-edit-create-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="usuario-edit-create-content">
                <div className="usuario-edit-create-header">
                    <h2>{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="usuario-modal-form" autoComplete="off">
                    {/* Primera fila: Nombre y Correo */}
                    <div className="usuario-form-row">
                        <div className="usuario-form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'usuario-form-control error' : 'usuario-form-control'}
                                placeholder="Ingrese el nombre completo"
                                maxLength="30"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.nombre && <div className="usuario-error-message">{errors.nombre}</div>}
                        </div>
                        
                        <div className="usuario-form-group">
                            <label htmlFor="correo">Correo:</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={errors.correo ? 'usuario-form-control error' : 'usuario-form-control'}
                                placeholder="Ingrese el correo electrónico"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.correo && <div className="usuario-error-message">{errors.correo}</div>}
                        </div>
                    </div>
                    
                    {/* Segunda fila: Contraseña y Rol */}
                    <div className="usuario-form-row">
                        <div className="usuario-form-group">
                            <label htmlFor="password">
                                {isEdit ? 'Nueva Contraseña (opcional):' : 'Contraseña:'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'usuario-form-control error' : 'usuario-form-control'}
                                placeholder={isEdit ? "Dejar vacío para mantener actual" : "Ingrese la contraseña"}
                                minLength="6"
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            {errors.password && <div className="usuario-error-message">{errors.password}</div>}
                        </div>
                        
                        <div className="usuario-form-group">
                            <label htmlFor="rol">Rol:</label>
                            <select
                                id="rol"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className={errors.rol ? 'usuario-form-control error' : 'usuario-form-control'}
                                autoComplete="off"
                            >
                                <option value="lector">Lector</option>
                                <option value="bibliotecario">Bibliotecario</option>
                                <option value="admin">Administrador</option>
                            </select>
                            {errors.rol && <div className="usuario-error-message">{errors.rol}</div>}
                        </div>
                    </div>
                    
                    {/* Tercera fila: Botones */}
                    <div className="usuario-modal-actions">
                        <button type="submit" className="usuario-save-button">
                            {isEdit ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" onClick={onClose} className="usuario-cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateUsuario;

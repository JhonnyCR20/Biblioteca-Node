import React, { useState, useRef, useEffect } from 'react';
import './css/EditCreateUsuario.css';

const EditCreateUsuario = ({ initialData, onClose, onSave, isEdit = false }) => {
    // Debug: Ver qué datos llegan    console.log('=== MODAL ABIERTO ===');
    console.log('EditCreateUsuario - Modo:', isEdit ? 'EDITAR' : 'CREAR');
    console.log('EditCreateUsuario - initialData:', initialData);
    console.log('EditCreateUsuario - isEdit:', isEdit);
    
    // VERIFICACIÓN DE SEGURIDAD: En modo crear, initialData debe ser undefined/null
    if (!isEdit && initialData) {
        console.warn('⚠️ ADVERTENCIA: Se pasaron datos iniciales en modo CREAR. Esto será ignorado.');
        console.warn('initialData recibido:', initialData);
    }
    
    console.log('===================');// Función para obtener los valores iniciales
    const getInitialFormData = () => {
        if (isEdit && initialData) {
            return {
                nombre: initialData.nombre || '',
                correo: initialData.correo || '',
                clave: '',
                rol: initialData.rol || 'empleado',
            };
        } else {
            // Modo crear: todo vacío
            return {
                nombre: '',
                correo: '',
                clave: '',
                rol: '',
            };
        }
    };

    const [formData, setFormData] = useState(getInitialFormData());    // Efecto para resetear el formulario cuando cambie el modo o los datos iniciales
    useEffect(() => {
        console.log('=== USEEFFECT EJECUTADO ===');
        console.log('isEdit:', isEdit);
        console.log('initialData:', initialData);
        
        let newFormData;
        if (isEdit && initialData) {
            newFormData = {
                nombre: initialData.nombre || '',
                correo: initialData.correo || '',
                clave: '',
                rol: initialData.rol || 'empleado',
            };
        } else {
            // Modo crear: todo vacío
            newFormData = {
                nombre: '',
                correo: '',
                clave: '',
                rol: '',
            };
        }
        
        console.log('newFormData:', newFormData);
        setFormData(newFormData);
        // También limpiar errores al cambiar modo
        setErrors({});
        console.log('=========================');
    }, [isEdit, initialData]);
    
    const [showPassword, setShowPassword] = useState(false);
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
        if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio';
        if (!formData.rol.trim()) newErrors.rol = 'El rol es obligatorio';
        
        // Validar contraseña solo si se proporciona
        if (formData.clave.trim()) {
            if (formData.clave.length < 8) {
                newErrors.clave = 'La contraseña debe tener al menos 8 caracteres';
            } else if (formData.clave.length > 24) {
                newErrors.clave = 'La contraseña no puede tener más de 24 caracteres';
            }
        } else if (!isEdit) {
            // En modo crear, la contraseña es obligatoria
            newErrors.clave = 'La contraseña es obligatoria';
        }
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.correo && !emailRegex.test(formData.correo)) {
            newErrors.correo = 'Formato de correo inválido';
        }
        
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
    };      const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Si es edición y no se cambió la contraseña, no enviarla
            const dataToSend = { ...formData };
            if (isEdit && !formData.clave.trim()) {
                delete dataToSend.clave;
            }
            
            // Debug: Ver qué se va a enviar
            console.log('Datos a enviar:', dataToSend);
            console.log('Modo:', isEdit ? 'EDITAR' : 'CREAR');
            
            onSave(dataToSend);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
      return (
        <div className="usuario-edit-create-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="usuario-edit-create-content">
                <div className="usuario-edit-create-header">
                    <h2>{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                </div>                <form onSubmit={handleSubmit} className="usuario-edit-create-form" style={{gap: '5px !important', display: 'flex', flexDirection: 'column'}}>
                    <div className="usuario-form-row" style={{gap: '10px !important', marginBottom: '5px !important', display: 'flex'}}>
                        <div className="usuario-form-group" style={{marginBottom: '5px !important', display: 'flex', flexDirection: 'column'}}>
                            <label htmlFor="nombre" style={{marginBottom: '3px !important'}}>Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'usuario-form-control error' : 'usuario-form-control'}
                                maxLength="100"
                            />
                            {errors.nombre && <div className="usuario-form-error-message">{errors.nombre}</div>}
                        </div>                        
                        <div className="usuario-form-group" style={{marginBottom: '5px'}}>
                            <label htmlFor="correo" style={{marginBottom: '3px'}}>Correo:</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={errors.correo ? 'usuario-form-control error' : 'usuario-form-control'}
                                maxLength="100"
                            />
                            {errors.correo && <div className="usuario-form-error-message">{errors.correo}</div>}
                        </div>
                    </div>                    
                    <div className="usuario-form-row" style={{gap: '10px', marginBottom: '5px'}}>                        <div className="usuario-form-group" style={{marginBottom: '5px'}}>
                            <label htmlFor="clave" style={{marginBottom: '3px'}}>
                                {isEdit ? 'Nueva Contraseña (opcional):' : 'Contraseña:'}
                            </label>
                            <div className="usuario-password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="clave"
                                    name="clave"
                                    value={formData.clave}
                                    onChange={handleChange}
                                    className={`usuario-form-control usuario-password-input ${errors.clave ? 'error' : ''}`}
                                    minLength="8"
                                    maxLength="24"
                                    placeholder={isEdit ? 'Vacio por defecto' : ''}
                                />                                <button
                                    type="button"
                                    className="usuario-password-toggle"
                                    onClick={togglePasswordVisibility}
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? '�' : '👁️'}
                                </button>
                            </div>
                            {errors.clave && <div className="usuario-form-error-message">{errors.clave}</div>}
                        </div>                        
                        <div className="usuario-form-group" style={{marginBottom: '5px'}}>
                            <label htmlFor="rol" style={{marginBottom: '3px'}}>Rol:</label>
                            <select
                                id="rol"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className={errors.rol ? 'usuario-form-control error' : 'usuario-form-control'}
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="admin">Administrador</option>
                                <option value="empleado">Empleado</option>
                                <option value="supervisor">Supervisor</option>
                            </select>
                            {errors.rol && <div className="usuario-form-error-message">{errors.rol}</div>}
                        </div>
                    </div>                    
                    <div className="usuario-edit-create-actions" style={{marginTop: '10px', paddingTop: '8px'}}>
                        <button type="submit" className="usuario-guardar-btn">Guardar</button>
                        <button type="button" onClick={onClose} className="usuario-cancelar-btn">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreateUsuario;

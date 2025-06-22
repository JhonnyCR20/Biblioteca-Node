import React, { useState, useRef } from 'react';
import './EditCreateAuthor.css';

const EditCreateAuthor = ({ onClose, onSave, initialData = {} }) => {
    const [nombre, setNombre] = useState(initialData.nombre || '');
    const [nacionalidad, setNacionalidad] = useState(initialData.nacionalidad || '');
    const modalRef = useRef(null);

    const handleSave = () => {
        if (nombre && nacionalidad) {
            onSave({ nombre, nacionalidad });
        }
    };

    // Cerrar modal al hacer click fuera del contenido
    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="edit-create-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-modal-content">
                <h2>{initialData && initialData.id_autor ? 'Editar Autor' : 'Crear Autor'}</h2>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        className="form-control"
                        placeholder="Escribe aquí"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nacionalidad">Nacionalidad</label>
                    <input
                        id="nacionalidad"
                        type="text"
                        className="form-control"
                        placeholder="Escribe aquí"
                        value={nacionalidad}
                        onChange={(e) => setNacionalidad(e.target.value)}
                    />
                </div>
                <button className="edit-create-modal-save-button" onClick={handleSave}>{initialData && initialData.id_autor ? 'Guardar' : 'Crear'}</button>
                <button className="edit-create-modal-close-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default EditCreateAuthor;

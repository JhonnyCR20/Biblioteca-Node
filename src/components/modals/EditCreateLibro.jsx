import React, { useState, useRef, useEffect } from 'react';
import './EditCreateLibro.css';
import { obtenerAutores } from '../../services/autoresService';

const EditCreateLibro = ({ onClose, onSave, initialData = {} }) => {
    const [titulo, setTitulo] = useState(initialData.titulo || '');
    const [autorId, setAutorId] = useState(initialData.autorId || initialData.id_autor || '');
    const [fechaPublicacion, setFechaPublicacion] = useState(initialData.fechaPublicacion || initialData.anio_publicacion || '');
    const [genero, setGenero] = useState(initialData.genero || initialData.categoria_nombre || '');
    const [autores, setAutores] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        async function fetchAutores() {
            try {
                const data = await obtenerAutores();
                setAutores(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
            } catch (error) {
                setAutores([]);
            }
        }
        fetchAutores();
    }, []);

    const isEdit = initialData && (initialData.id || initialData.id_libro);

    const handleSave = () => {
        if (titulo && autorId && fechaPublicacion && genero) {
            onSave({ titulo, autorId, fechaPublicacion, genero });
        }
    };

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div className="edit-create-libro-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-libro-modal-content">
                <h2>{isEdit ? 'Editar Libro' : 'Crear Libro'}</h2>
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input
                        id="titulo"
                        type="text"
                        className="form-control"
                        placeholder="Escribe aquí"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="autorId">Autor</label>
                    <select
                        id="autorId"
                        className="form-control"
                        value={autorId}
                        onChange={(e) => setAutorId(e.target.value)}
                    >
                        <option value="">Selecciona un autor</option>
                        {autores.map((autor) => (
                            <option key={autor.id_autor} value={autor.id_autor}>{autor.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="fechaPublicacion">Fecha de Publicación</label>
                    <input
                        id="fechaPublicacion"
                        type="date"
                        className="form-control"
                        value={fechaPublicacion}
                        onChange={(e) => setFechaPublicacion(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="genero">Género</label>
                    <input
                        id="genero"
                        type="text"
                        className="form-control"
                        placeholder="Escribe aquí"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                    />
                </div>
                <button className="edit-create-libro-modal-save-button" onClick={handleSave}>{isEdit ? 'Editar' : 'Crear'}</button>
                <button className="edit-create-libro-modal-close-button" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default EditCreateLibro;

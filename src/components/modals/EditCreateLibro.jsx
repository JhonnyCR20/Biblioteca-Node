import React, { useState, useRef, useEffect } from 'react';
import './EditCreateLibro.css';
import { obtenerAutores } from '../../services/autoresService';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { obtenerGeneros } from '../../services/generosService';
import { obtenerEditoriales } from '../../services/editorialesService';

const EditCreateLibro = ({ onClose, onSave, initialData = {}, autoresGlobal = [] }) => {
    const [titulo, setTitulo] = useState(initialData.titulo || '');
    const [autorId, setAutorId] = useState(
        initialData.id_autor?.toString() || initialData.autorId?.toString() || (initialData.autor && initialData.autor.id_autor?.toString()) || ''
    );
    const [fechaPublicacion, setFechaPublicacion] = useState(initialData.fechaPublicacion ? new Date(initialData.fechaPublicacion) : (initialData.anio_publicacion ? new Date(initialData.anio_publicacion) : null));
    const [generoId, setGeneroId] = useState(initialData.id_categoria || '');
    const [editorialId, setEditorialId] = useState(initialData.id_editorial || '');
    const [isbn, setIsbn] = useState(initialData.isbn || '');
    const [cantidadDisponible, setCantidadDisponible] = useState(initialData.cantidad_disponible || 1);
    const [autores, setAutores] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [editoriales, setEditoriales] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        async function fetchAutores() {
            try {
                let autoresArr = [];
                // Siempre cargar desde la API para evitar inconsistencias
                const data = await obtenerAutores();
                if (Array.isArray(data.data)) {
                    autoresArr = data.data;
                } else if (Array.isArray(data)) {
                    autoresArr = data;
                } else if (data && Array.isArray(data.autores)) {
                    autoresArr = data.autores;
                }
                setAutores(autoresArr);
                if ((!autorId || autorId === '') && autoresArr.length > 0) {
                    setAutorId(autoresArr[0].id_autor.toString());
                }
            } catch (error) {
                setAutores([]);
            }
        }
        async function fetchGeneros() {
            try {
                const data = await obtenerGeneros();
                setGeneros(Array.isArray(data) ? data : []);
            } catch (error) {
                setGeneros([]);
            }
        }
        async function fetchEditoriales() {
            try {
                const data = await obtenerEditoriales();
                setEditoriales(Array.isArray(data) ? data : []);
            } catch (error) {
                setEditoriales([]);
            }
        }
        fetchAutores();
        fetchGeneros();
        fetchEditoriales();
    }, []);

    const isEdit = initialData && (initialData.id || initialData.id_libro);

    const handleSave = () => {
        const libroPayload = {
            titulo,
            anio_publicacion: fechaPublicacion ? fechaPublicacion.getFullYear().toString() : '',
            id_categoria: generoId,
            id_editorial: editorialId,
            isbn,
            cantidad_disponible: cantidadDisponible,
            autores: autorId ? [parseInt(autorId)] : [],
        };
        if (titulo && autorId && fechaPublicacion && generoId && editorialId) {
            onSave(libroPayload);
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
                <div className="edit-create-libro-modal-form-grid">
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
                                <option key={autor.id_autor} value={autor.id_autor.toString()}>{autor.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaPublicacion">Año de Publicación</label>
                        <ReactDatePicker
                            id="fechaPublicacion"
                            className="form-control"
                            selected={fechaPublicacion ? new Date(fechaPublicacion) : null}
                            onChange={date => setFechaPublicacion(date)}
                            dateFormat="yyyy"
                            showYearPicker
                            placeholderText="Selecciona el año"
                            isClearable
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genero">Género</label>
                        <select
                            id="genero"
                            className="form-control"
                            value={generoId}
                            onChange={e => setGeneroId(e.target.value)}
                        >
                            <option value="">Selecciona un género</option>
                            {generos && generos.length > 0 && generos.map((g) => (
                                <option key={g.id_categoria} value={g.id_categoria}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="editorialId">Editorial</label>
                        <select
                            id="editorialId"
                            className="form-control"
                            value={editorialId}
                            onChange={e => setEditorialId(e.target.value)}
                        >
                            <option value="">Selecciona una editorial</option>
                            {editoriales && editoriales.length > 0 && editoriales.map((ed) => (
                                <option key={ed.id_editorial} value={ed.id_editorial}>{ed.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="isbn">ISBN</label>
                        <input
                            id="isbn"
                            type="text"
                            className="form-control"
                            placeholder="978-3-16-148410-0"
                            value={isbn}
                            maxLength={17}
                            onChange={e => {
                                // Permite solo números y guiones
                                let value = e.target.value.replace(/[^0-9]/g, '');
                                // Formato: 978-3-16-148410-0
                                if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
                                if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
                                if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
                                if (value.length > 14) value = value.slice(0, 14) + '-' + value.slice(14);
                                if (value.length > 17) value = value.slice(0, 17); // Limita a 13 dígitos y 4 guiones
                                setIsbn(value);
                            }}
                            pattern="978|979-[0-9]-[0-9]{2}-[0-9]{6}-[0-9]"
                            inputMode="numeric"
                            autoComplete="off"
                            readOnly={isEdit} // Solo lectura si es edición
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cantidad_disponible">Cantidad Disponible</label>
                        <input
                            id="cantidad_disponible"
                            type="number"
                            className="form-control"
                            placeholder="Cantidad"
                            value={cantidadDisponible}
                            onChange={e => setCantidadDisponible(e.target.value)}
                        />
                    </div>
                </div>
                <div className="edit-create-libro-modal-buttons">
                    <button className="edit-create-libro-modal-save-button" onClick={handleSave}>{isEdit ? 'Editar' : 'Crear'}</button>
                    <button className="edit-create-libro-modal-close-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default EditCreateLibro;

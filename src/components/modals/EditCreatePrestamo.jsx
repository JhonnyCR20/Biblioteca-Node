import React, { useState, useRef, useEffect } from 'react';
import { obtenerLibros } from '../../services/librosService';
import { obtenerLectores } from '../../services/lectoresService';
import { obtenerDetallesPorPrestamo } from '../../services/detallesPrestamosService';
import './css/EditCreatePrestamo.css';

const EditCreatePrestamo = ({ prestamo, onClose, onSave, isEdit = false }) => {
    const modalRef = useRef(null);
      const [libros, setLibros] = useState([]);
    const [lectores, setLectores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [librosSeleccionados, setLibrosSeleccionados] = useState([{ id_libro: '', cantidad: 1 }]);    const [formData, setFormData] = useState({
        id_lector: String(prestamo?.id_lector || ''),
        fecha_prestamo: formatearFechaParaInput(prestamo?.fecha_prestamo) || '',
        fecha_devolucion: formatearFechaParaInput(prestamo?.fecha_devolucion_prevista || prestamo?.fecha_devolucion) || '',
        estado: prestamo?.estado || 'activo'
    });

    // Función para formatear fechas para inputs de tipo date
    function formatearFechaParaInput(fecha) {
        if (!fecha) return '';
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    }

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [librosData, lectoresData] = await Promise.all([
                    obtenerLibros(),
                    obtenerLectores()                ]);
                
                setLibros(Array.isArray(librosData) ? librosData : []);
                setLectores(Array.isArray(lectoresData) ? lectoresData : []);// Si estamos editando, intentar cargar los detalles del préstamo
                if (isEdit && prestamo?.id_prestamo) {
                    try {
                        const detallesData = await obtenerDetallesPorPrestamo(prestamo.id_prestamo);
                        if (Array.isArray(detallesData) && detallesData.length > 0) {
                            const librosDelPrestamo = detallesData.map(detalle => ({
                                id_libro: String(detalle.id_libro),
                                cantidad: detalle.cantidad,
                                id_detalle: detalle.id_detalle
                            }));
                            setLibrosSeleccionados(librosDelPrestamo);
                        }
                    } catch (detallesError) {
                        console.warn('No se pudieron cargar los detalles del préstamo para edición:', detallesError);
                        // Mantener el libro vacío por defecto si no se pueden cargar los detalles
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar libros y lectores: ' + error.message);
            } finally {
                setLoading(false);
            }
        };        cargarDatos();
    }, [isEdit, prestamo]);    // Efecto para actualizar el formulario cuando cambian los datos del préstamo
    useEffect(() => {        if (prestamo) {
            setFormData({
                id_lector: String(prestamo.id_lector || ''), // Convertir a string
                fecha_prestamo: formatearFechaParaInput(prestamo.fecha_prestamo) || '',
                fecha_devolucion: formatearFechaParaInput(prestamo.fecha_devolucion_prevista || prestamo.fecha_devolucion) || '',
                estado: prestamo.estado || 'activo'
            });
        }
    }, [prestamo]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose();
        }
    };    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Cambiando ${name} a:`, value); // Debug
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };    const handleLibroChange = (index, field, value) => {
        const nuevosLibros = [...librosSeleccionados];
        
        if (field === 'id_libro' && value) {
            // Verificar si el libro ya está seleccionado en otro índice
            const yaSeleccionado = nuevosLibros.some((libro, i) => 
                i !== index && libro.id_libro === value
            );
            
            if (yaSeleccionado) {
                alert('Este libro ya está seleccionado. Por favor, elige otro libro o ajusta la cantidad del existente.');
                return;
            }
        }
        
        nuevosLibros[index][field] = value;
        setLibrosSeleccionados(nuevosLibros);
    };

    const agregarLibro = () => {
        setLibrosSeleccionados([...librosSeleccionados, { id_libro: '', cantidad: 1 }]);
    };    const eliminarLibro = (index) => {
        if (librosSeleccionados.length > 1) {
            const nuevosLibros = librosSeleccionados.filter((_, i) => i !== index);
            setLibrosSeleccionados(nuevosLibros);
        }
    };    const obtenerStockLibro = (idLibro) => {        const libro = libros.find(l => l.id_libro == idLibro);
        if (!libro) {
            return 0;
        }
        
        // Buscar el campo de stock probando diferentes nombres comunes
        const posiblesCampos = ['stock', 'cantidad', 'disponible', 'existencias', 'cantidad_disponible', 'inventario'];
        let stock = 0;
        let campoEncontrado = null;
        
        for (const campo of posiblesCampos) {
            if (libro[campo] !== undefined && libro[campo] !== null) {
                stock = parseInt(libro[campo]) || 0;
                campoEncontrado = campo;
                break;
            }
        }
          console.log(`Stock para libro ${libro.titulo} (ID ${idLibro}): ${stock} (campo: ${campoEncontrado || 'no encontrado'})`);
        
        return stock;
    };

    const obtenerMaxCantidad = (idLibro) => {
        const stock = obtenerStockLibro(idLibro);
        // Contar cuántas veces está seleccionado este libro en otros campos
        const vecesSeleccionado = librosSeleccionados.filter(
            (libro, index) => libro.id_libro == idLibro
        ).length;
        
        return Math.max(1, stock);
    };const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.id_lector || !formData.fecha_prestamo || !formData.fecha_devolucion) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        // Validar que al menos haya un libro seleccionado
        const libroValido = librosSeleccionados.some(libro => libro.id_libro && libro.cantidad > 0);
        if (!libroValido) {
            alert('Debe seleccionar al menos un libro con cantidad válida');
            return;
        }

        // Preparar datos para envío
        const dataToSend = { 
            ...formData,
            libros: librosSeleccionados.filter(libro => libro.id_libro && libro.cantidad > 0)
        };
          // Convertir IDs a números si es necesario
        dataToSend.id_lector = parseInt(dataToSend.id_lector);

        console.log('Datos a enviar:', dataToSend);
        onSave(dataToSend);
    };

    return (
        <div className="edit-create-prestamo-modal" ref={modalRef} onClick={handleBackdropClick}>
            <div className="edit-create-prestamo-modal-content">
                <div className="edit-create-prestamo-modal-header">
                    <h2>{isEdit ? 'Editar Préstamo' : 'Crear Nuevo Préstamo'}</h2>
                </div>
                  <form onSubmit={handleSubmit} className="edit-create-prestamo-form">
                    {loading ? (
                        <div className="loading-container">
                            <p>Cargando datos...</p>
                        </div>
                    ) : (
                        <>                            {/* Primera sección: Selección de libros */}
                            <div className="libros-section">
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                                    Libros del Préstamo *
                                </label>
                                {librosSeleccionados.map((libroSeleccionado, index) => (
                                    <div key={index} className="form-row" style={{ alignItems: 'end', marginBottom: '10px' }}>
                                        <div className="edit-create-prestamo-form-group" style={{ flex: 2 }}>
                                            <label htmlFor={`libro-${index}`}>Libro</label>
                                            <select
                                                id={`libro-${index}`}
                                                value={libroSeleccionado.id_libro}
                                                onChange={(e) => handleLibroChange(index, 'id_libro', e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccionar libro...</option>
                                                {libros.map((libro) => (
                                                    <option 
                                                        key={libro.id_libro} 
                                                        value={String(libro.id_libro)}
                                                    >
                                                        {libro.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>                                        <div className="edit-create-prestamo-form-group" style={{ flex: 1 }}>
                                            <label htmlFor={`cantidad-${index}`}>
                                                Cantidad {libroSeleccionado.id_libro && `(Stock: ${obtenerStockLibro(libroSeleccionado.id_libro)})`}
                                            </label>
                                            <input
                                                type="number"
                                                id={`cantidad-${index}`}
                                                min="1"
                                                max={libroSeleccionado.id_libro ? obtenerMaxCantidad(libroSeleccionado.id_libro) : undefined}
                                                value={libroSeleccionado.cantidad}
                                                onChange={(e) => {
                                                    const nuevaCantidad = parseInt(e.target.value) || 1;
                                                    const maxCantidad = libroSeleccionado.id_libro ? obtenerMaxCantidad(libroSeleccionado.id_libro) : 999;
                                                    const cantidadFinal = Math.min(nuevaCantidad, maxCantidad);
                                                    handleLibroChange(index, 'cantidad', cantidadFinal);
                                                }}
                                                required
                                            />
                                        </div>

                                        <div style={{ marginLeft: '10px' }}>
                                            {librosSeleccionados.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarLibro(index)}
                                                    style={{
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                <button
                                    type="button"
                                    onClick={agregarLibro}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginBottom: '20px'
                                    }}
                                >
                                    + Agregar Libro
                                </button>
                            </div>

                            {/* Segunda fila: Lector */}
                            <div className="form-row">
                                <div className="edit-create-prestamo-form-group">
                                    <label htmlFor="id_lector">Lector *</label>
                                    <select
                                        id="id_lector"
                                        name="id_lector"
                                        value={formData.id_lector}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar lector...</option>
                                        {lectores.map((lector) => (
                                            <option 
                                                key={lector.id_lector} 
                                                value={String(lector.id_lector)}
                                            >
                                                {lector.nombre} {lector.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>                            {/* Tercera fila: Fechas de préstamo y devolución */}
                            <div className="form-row">
                                <div className="edit-create-prestamo-form-group">
                                    <label htmlFor="fecha_prestamo">Fecha de Préstamo *</label>
                                    <input
                                        type="date"
                                        id="fecha_prestamo"
                                        name="fecha_prestamo"
                                        value={formData.fecha_prestamo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="edit-create-prestamo-form-group">
                                    <label htmlFor="fecha_devolucion">Fecha de Devolución *</label>
                                    <input
                                        type="date"
                                        id="fecha_devolucion"
                                        name="fecha_devolucion"
                                        value={formData.fecha_devolucion}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>                            </div>

                            {/* Cuarta fila: Estado */}
                            <div className="form-row">
                                <div className="edit-create-prestamo-form-group">
                                    <label htmlFor="estado">Estado *</label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="devuelto">Devuelto</option>
                                        <option value="vencido">Vencido</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="edit-create-prestamo-modal-actions">
                        <button 
                            type="submit"
                            className="edit-create-prestamo-save-button"
                            disabled={loading}
                        >
                            Guardar
                        </button>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="edit-create-prestamo-cancel-button"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCreatePrestamo;

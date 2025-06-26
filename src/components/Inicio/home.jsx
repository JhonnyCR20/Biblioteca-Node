import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerLibros, crearLibro, eliminarLibro } from '../../services/librosService';
import { obtenerPrestamos } from '../../services/prestamosService';
import { obtenerLectores } from '../../services/lectoresService';
import { obtenerMultas } from '../../services/multasService';
import catalogoImg from '../../assets/catalogo.png';
import prestamoImg from '../../assets/prestamo.png';
import './home.css';

const Home = () => {
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [lectores, setLectores] = useState([]);
  const [multas, setMultas] = useState([]);
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(true);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', anio_publicacion: '' });
  const [activeSection, setActiveSection] = useState(0);

  // Referencias para las secciones
  const featuresRef = React.useRef(null);
  const estadisticasRef = React.useRef(null);

  useEffect(() => {
    // Observador para detectar qué sección está visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('features')) {
              setActiveSection(0);
            } else if (entry.target.classList.contains('estadisticas-rapidas')) {
              setActiveSection(1);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (estadisticasRef.current) observer.observe(estadisticasRef.current);

    return () => observer.disconnect();
  }, []);

  // Función para navegar a una sección específica
  const scrollToSection = (sectionIndex) => {
    const sections = [featuresRef.current, estadisticasRef.current];
    if (sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    async function fetchDatos() {
      try {
        // Obtener libros
        const dataLibros = await obtenerLibros();
        console.log('Libros obtenidos:', dataLibros);
        setLibros(dataLibros);

        // Obtener préstamos
        try {
          const dataPrestamos = await obtenerPrestamos();
          console.log('Préstamos obtenidos:', dataPrestamos);
          setPrestamos(Array.isArray(dataPrestamos) ? dataPrestamos : []);
        } catch (error) {
          console.error('Error al obtener préstamos:', error);
          setPrestamos([]);
        }

        // Obtener lectores
        try {
          const dataLectores = await obtenerLectores();
          console.log('Lectores obtenidos:', dataLectores);
          setLectores(Array.isArray(dataLectores) ? dataLectores : []);
        } catch (error) {
          console.error('Error al obtener lectores:', error);
          setLectores([]);
        }

        // Obtener multas
        try {
          const dataMultas = await obtenerMultas();
          console.log('Multas obtenidas:', dataMultas);
          console.log('Tipo de dataMultas:', typeof dataMultas);
          console.log('Es array:', Array.isArray(dataMultas));
          
          if (Array.isArray(dataMultas)) {
            setMultas(dataMultas);
            console.log('Multas establecidas:', dataMultas.length, 'multas');
          } else {
            console.warn('DataMultas no es un array:', dataMultas);
            setMultas([]);
          }
        } catch (error) {
          console.error('Error al obtener multas:', error);
          setMultas([]);
        }

        // Marcar como completada la carga
        setCargandoEstadisticas(false);

      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setCargandoEstadisticas(false);
      }
    }
    fetchDatos();
  }, []);

  // Funciones para calcular estadísticas
  const getPrestamosActivos = () => {
    return prestamos.filter(prestamo => 
      prestamo.estado === 'activo' || 
      prestamo.estado === 'prestado' || 
      !prestamo.fecha_devolucion
    ).length;
  };

  const getMultasPendientes = () => {
    console.log('Calculando multas pendientes...');
    console.log('Total multas:', multas.length);
    console.log('Estructura de todas las multas:', multas);
    
    if (!Array.isArray(multas) || multas.length === 0) {
      console.log('No hay multas o no es un array');
      return 0;
    }
    
    const multasPendientes = multas.filter(multa => {
      // Lógica más específica para multas pendientes
      const esPendiente = 
        (multa.estado === 'pendiente') ||
        (multa.estado === 'activa') ||
        (multa.estado === 'activo') ||
        // Si existe el campo pagada/pagado, verificar que sea false
        (multa.pagada === false || multa.pagada === 0 || multa.pagada === '0') ||
        (multa.pagado === false || multa.pagado === 0 || multa.pagado === '0') ||
        // Si no existe el campo pagada/pagado, considerar solo estados específicos
        (!multa.hasOwnProperty('pagada') && !multa.hasOwnProperty('pagado') && 
         multa.estado !== 'pagada' && multa.estado !== 'pagado' && multa.estado !== 'completada');
        
      console.log(`Multa ID ${multa.id_multa || multa.id}:`, {
        estado: multa.estado,
        pagada: multa.pagada,
        pagado: multa.pagado,
        esPendiente: esPendiente
      });
      
      return esPendiente;
    });
    
    console.log('Multas pendientes encontradas:', multasPendientes.length);
    console.log('Detalle de multas pendientes:', multasPendientes);
    return multasPendientes.length;
  };

  const handleCrearLibro = async () => {
    try {
      const libroCreado = await crearLibro(nuevoLibro);
      setLibros([...libros, libroCreado]);
      setNuevoLibro({ titulo: '', anio_publicacion: '' });
    } catch (error) {
      console.error('Error al crear el libro:', error);
    }
  };

  const handleEliminarLibro = async (id) => {
    try {
      await eliminarLibro(id);
      setLibros(libros.filter((libro) => (libro.id || libro.id_libro) !== id));
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  return (
    <div className="home">
      {/* Indicadores de navegación */}
      <div className="scroll-indicator">
        <div 
          className={`scroll-dot ${activeSection === 0 ? 'active' : ''}`}
          onClick={() => scrollToSection(0)}
          title="Funcionalidades del Sistema"
        />
        <div 
          className={`scroll-dot ${activeSection === 1 ? 'active' : ''}`}
          onClick={() => scrollToSection(1)}
          title="Vista Rápida del Sistema"
        />
      </div>

      <section className="features" ref={featuresRef}>
        <h2>Funcionalidades del Sistema</h2>
        <div className="features-grid">
          <div key="feature-catalogo" className="feature-card">
            <div className="feature-icon">
              <img src={catalogoImg} alt="Catálogo Digital" />
            </div>
            <h3>Catálogo Digital</h3>
            <p>Gestiona el catálogo completo de libros con búsqueda avanzada</p>
          </div>

          <div key="feature-prestamos" className="feature-card">
            <div className="feature-icon">
              <img src={prestamoImg} alt="Control de Préstamos" />
            </div>
            <h3>Control de Préstamos</h3>
            <p>Administra préstamos, devoluciones y renovaciones eficientemente</p>
          </div>

          <div key="feature-usuarios" className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Gestión de Usuarios</h3>
            <p>Administra lectores, bibliotecarios y perfiles de usuario</p>
          </div>

          <div key="feature-reportes" className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reportes y Estadísticas</h3>
            <p>Genera reportes detallados del uso de la biblioteca</p>
          </div>
        </div>
      </section>

      <section className="estadisticas-rapidas" ref={estadisticasRef}>
        <h2>Vista Rápida del Sistema</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-number">{cargandoEstadisticas ? '...' : libros.length}</div>
            <div className="stat-label">Libros en Catálogo</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-number">{cargandoEstadisticas ? '...' : getPrestamosActivos()}</div>
            <div className="stat-label">Préstamos Activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-number">{cargandoEstadisticas ? '...' : lectores.length}</div>
            <div className="stat-label">Lectores Registrados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-number" title={`Total multas: ${multas.length}, Pendientes: ${getMultasPendientes()}`}>
              {cargandoEstadisticas ? '...' : getMultasPendientes()}
            </div>
            <div className="stat-label">Multas Pendientes</div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
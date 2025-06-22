import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerLibros, crearLibro, eliminarLibro } from '../../services/librosService';
import './home.css';

const Home = () => {
  const [libros, setLibros] = useState([]);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', anio_publicacion: '' });

  useEffect(() => {
    async function fetchLibros() {
      try {
        const data = await obtenerLibros();
        setLibros(data);
      } catch (error) {
        console.error('Error al obtener los libros:', error);
      }
    }
    fetchLibros();
  }, []);

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
      setLibros(libros.filter((libro) => libro.id !== id));
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a Academia</h1>
          <p>Descubre una nueva forma de aprender con nuestros cursos especializados</p>
          <Link to="/cursos" className="cta-button">Explorar Cursos</Link>
        </div>
      </section>

      <section className="features">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Profesores Expertos</h3>
            <p>Aprende con los mejores profesionales en su campo</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Cursos Actualizados</h3>
            <p>Contenido actualizado y relevante para el mercado actual</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Aprendizaje Personalizado</h3>
            <p>Grupos reducidos para una atención más personalizada</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Clases Flexibles</h3>
            <p>Horarios adaptados a tus necesidades</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Listo para empezar?</h2>
        <p>Únete a nuestra comunidad de estudiantes y comienza tu viaje de aprendizaje hoy</p>
        <Link to="/cursos" className="cta-button">Comenzar Ahora</Link>
      </section>

      <section className="gestion-libros">
        <h2>Gestión de Libros</h2>
        <ul>
          {libros.map((libro) => (
            <li key={libro.id}>
              {libro.titulo} - {libro.anio_publicacion}
              <button onClick={() => handleEliminarLibro(libro.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <div className="crear-libro">
          <h2>Crear Libro</h2>
          <input
            type="text"
            placeholder="Título"
            value={nuevoLibro.titulo}
            onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Año de Publicación"
            value={nuevoLibro.anio_publicacion}
            onChange={(e) => setNuevoLibro({ ...nuevoLibro, anio_publicacion: e.target.value })}
          />
          <button onClick={handleCrearLibro}>Crear</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
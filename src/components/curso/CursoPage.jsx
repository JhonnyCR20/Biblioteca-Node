import React, { useEffect, useState } from 'react';
import './curso.css';

function CursoPage() {
    const [cursos, setCursos] = useState([]);
    const [nuevoCurso, setNuevoCurso] = useState({ nombre: '', descripcion: '' });

    useEffect(() => {
        async function fetchCursos() {
            try {
                const response = await fetch('/api/cursos'); // Ajusta la URL según tu API
                const data = await response.json();
                setCursos(data);
            } catch (error) {
                console.error('Error al obtener los cursos:', error);
            }
        }
        fetchCursos();
    }, []);

    const handleCrearCurso = async () => {
        try {
            const response = await fetch('/api/cursos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoCurso),
            });
            const cursoCreado = await response.json();
            setCursos([...cursos, cursoCreado]);
            setNuevoCurso({ nombre: '', descripcion: '' });
        } catch (error) {
            console.error('Error al crear el curso:', error);
        }
    };

    return (
        <div className="curso-container">
            <h1>Gestión de Cursos</h1>
            <table className="curso-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map((curso) => (
                        <tr key={curso.id}>
                            <td>{curso.nombre}</td>
                            <td>{curso.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="crear-curso">
                <h2>Crear Curso</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoCurso.nombre}
                    onChange={(e) => setNuevoCurso({ ...nuevoCurso, nombre: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={nuevoCurso.descripcion}
                    onChange={(e) => setNuevoCurso({ ...nuevoCurso, descripcion: e.target.value })}
                />
                <button onClick={handleCrearCurso}>Crear</button>
            </div>
        </div>
    );
}

export default CursoPage;

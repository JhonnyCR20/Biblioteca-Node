import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Inicio/navbar'
import Home from './components/Inicio/home'
import AutoresPage from './components/autores/AutoresPage'
import LibrosPage from './components/libros/LibrosPage'
import EditorialesPage from './components/editoriales/EditorialesPage'
import CategoriasPage from './components/categorias/CategoriasPage'
import ReservasPage from './components/reservas/ReservasPage'
import LectoresPage from './components/lectores/LectoresPage'
import MultasPage from './components/multas/MultasPage'
import PrestamosPage from './components/prestamos/PrestamosPage'
import HistorialPage from './components/historial/HistorialPage'
import UsuariosPage from './components/usuarios/UsuariosPage'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autores" element={<AutoresPage />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/editoriales" element={<EditorialesPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/lectores" element={<LectoresPage />} />
          <Route path="/multas" element={<MultasPage />} />
          <Route path="/prestamos" element={<PrestamosPage />} />
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
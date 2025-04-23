"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./components/layout/sidebar"
import Navbar from "./components/layout/navbar"
import Cliente from "./pages/clientes/cliente"
import Pedido from "./pages/pedidos/pedido"
import Categoria from "./pages/categorias/categoria"
import Productos from "./pages/productos/productos"
import Usuario from "./pages/usuarios/usuario"
import Configuracion from "./pages/configuracion/configuracion"
import { SidebarProvider } from "./components/layout/sidebarContext"
import LoginPage from "./pages/usuarios/Login"
import { useSidebar } from "./components/layout/sidebarUtils"
import { AuthProvider, useAuth } from "./pages/usuarios/context/AuthContext"
import "./App.css"

// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoadingAuth, hasRole } = useAuth()

  if (isLoadingAuth) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verificar rol si es necesario
  if (requiredRole && !hasRole(requiredRole)) {
    return <div className="p-6 bg-red-900 text-white rounded-lg">No tienes permisos para acceder a esta página</div>
  }

  return children
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </AuthProvider>
    </Router>
  )
}

// Componente separado para acceder al contexto
function AppContent() {
  const { isExpanded } = useSidebar()
  const { isAuthenticated, isLoadingAuth } = useAuth()

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoadingAuth) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="flex h-screen">
      {isAuthenticated && <Sidebar />}
      <main
        className={`flex-1 ${isAuthenticated ? (isExpanded ? "ml-64" : "ml-20") : ""} overflow-y-auto transition-all duration-300`}
      >
        {isAuthenticated && <Navbar />}
        <div className={`${isAuthenticated ? "p-4 pt-20" : ""}`}>
          <Routes>
            {/* Redirigir "/" a login o dashboard según autenticación */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />

            {/* Página de Login */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

            {/* Rutas protegidas del sistema */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Cliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <Pedido />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuario"
              element={
                <ProtectedRoute requiredRole={1}>
                  {" "}
                  {/* Asumiendo que 1 es el ID del rol admin */}
                  <Usuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categoria"
              element={
                <ProtectedRoute>
                  <Categoria />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <Productos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <ProtectedRoute>
                  <Ventas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute requiredRole={1}>
                  {" "}
                  {/* Asumiendo que 1 es el ID del rol admin */}
                  <Configuracion />
                </ProtectedRoute>
              }
            />

            {/* Ruta para manejar páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

// Componente para manejar rutas no encontradas
function NotFound() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-600">Página no encontrada</p>
      </div>
    </div>
  )
}

// Componentes temporales para las rutas faltantes
function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
      {user && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-white">Bienvenido, {user.nombre}</p>
          <p className="text-gray-400">Rol: {user.id_rol}</p>
        </div>
      )}
    </div>
  )
}

function Ventas() {
  return <h1 className="text-2xl">Ventas</h1>
}

export default App

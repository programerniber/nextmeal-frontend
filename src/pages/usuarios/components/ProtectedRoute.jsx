"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { obtenerPermisosUsuario } from "../api/usuarioService"
import { AlertTriangle, ShieldOff } from "lucide-react"

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { user, isAuthenticated, isLoadingAuth, hasRole, navigateTo } = useAuth()
  const [authorized, setAuthorized] = useState(false)
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const verificarAcceso = async () => {
      // Si está cargando, esperar
      if (isLoadingAuth) {
        return
      }

      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        navigateTo("/login")
        return
      }

      try {
        // Cargar permisos del usuario
        if (requiredPermission) {
          setLoading(true)
          const data = await obtenerPermisosUsuario()
          setPermisos(data.permisos || [])
          setLoading(false)
        }

        // Verificar permisos y roles
        let hasAccess = true

        // Verificar rol si es requerido
        if (requiredRole && !hasRole(requiredRole)) {
          hasAccess = false
        }

        // Verificar permiso específico si es requerido
        if (requiredPermission && hasAccess) {
          const [recurso, accion] = requiredPermission.split(".")

          // Verificar si el usuario tiene el permiso requerido
          const tienePermiso =
            user.id_rol === 1 || // Administrador tiene todos los permisos
            permisos.some((p) => p.recurso === recurso && p.accion === accion)

          if (!tienePermiso) {
            hasAccess = false
          }
        }

        if (!hasAccess) {
          navigateTo("/unauthorized")
          return
        }

        setAuthorized(true)
      } catch (err) {
        console.error("Error al verificar permisos:", err)
        setError("Error al verificar permisos de acceso")
        setLoading(false)
      }
    }

    verificarAcceso()
  }, [isLoadingAuth, isAuthenticated, user, requiredPermission, requiredRole])

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoadingAuth || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Mostrar mensaje de error si ocurrió alguno
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
        <div className="bg-red-900/50 text-white p-6 rounded-lg border border-red-700 max-w-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-400 mr-3 h-8 w-8" />
            <h2 className="text-xl font-bold">Error de Acceso</h2>
          </div>
          <p>{error}</p>
          <button
            onClick={() => navigateTo("/dashboard")}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Si no está autorizado, mostrar página de acceso denegado
  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
        <div className="bg-orange-900/30 text-white p-6 rounded-lg border border-orange-700 max-w-md">
          <div className="flex items-center mb-4">
            <ShieldOff className="text-orange-400 mr-3 h-8 w-8" />
            <h2 className="text-xl font-bold">Acceso Denegado</h2>
          </div>
          <p>No tienes los permisos necesarios para acceder a esta sección.</p>
          <button
            onClick={() => navigateTo("/dashboard")}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Si está autorizado, mostrar los children
  return children
}

export default ProtectedRoute

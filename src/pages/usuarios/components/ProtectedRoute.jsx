"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { AlertTriangle, ShieldOff } from "lucide-react"

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { user, isAuthenticated, isLoadingAuth, hasRole, hasPermission, navigateTo } = useAuth()
  const [authorized, setAuthorized] = useState(false)
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
        setLoading(true)

        // Verificar permisos y roles
        let hasAccess = true

        // Verificar rol si es requerido
        if (requiredRole && !hasRole(requiredRole)) {
          console.log(`Acceso denegado: Se requiere rol ${requiredRole}`)
          hasAccess = false
        }

        // Verificar permiso específico si es requerido
        if (requiredPermission && hasAccess) {
          const [recurso, accion] = requiredPermission.split(".")

          // Verificar si el usuario tiene el permiso requerido
          // Si el usuario es admin (id_rol === 1) o tiene el permiso específico
          // O si solo se requiere permiso de "ver" (todos tienen permiso de ver)
          const tienePermiso = user.id_rol === 1 || hasPermission(recurso, accion) || accion === "ver" // Todos tienen permiso de ver

          console.log(
            `Verificando permiso ${requiredPermission}: ${tienePermiso ? "Tiene permiso" : "No tiene permiso"}`,
          )

          if (!tienePermiso) {
            console.log(`Acceso denegado: Se requiere permiso ${requiredPermission}`)
            hasAccess = false
          }
        }

        // Actualizar el estado de autorización
        setAuthorized(hasAccess)

        // Solo redirigir si explícitamente no tiene acceso y no está en el dashboard
        if (!hasAccess && window.location.pathname !== "/dashboard") {
          console.log("Redirigiendo al dashboard por falta de permisos")
          navigateTo("/dashboard")
          return
        }
      } catch (err) {
        console.error("Error al verificar permisos:", err)
        setError("Error al verificar permisos de acceso")
      } finally {
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

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { user, isAuthenticated, isLoadingAuth, hasPermission, hasRole, navigateTo } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Si está cargando, esperar
    if (isLoadingAuth) {
      return
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigateTo("/login")
      return
    }

    // Verificar permisos y roles
    let hasAccess = true

    if (requiredRole && !hasRole(requiredRole)) {
      hasAccess = false
    }

    if (requiredPermission) {
      const [recurso, accion] = requiredPermission.split(".")
      if (!hasPermission(recurso, accion)) {
        hasAccess = false
      }
    }

    if (!hasAccess) {
      navigateTo("/unauthorized")
      return
    }

    setAuthorized(true)
  }, [isLoadingAuth, isAuthenticated, user, requiredPermission, requiredRole])

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Si no está autorizado, no mostrar nada
  if (!authorized) {
    return null
  }

  // Si está autorizado, mostrar los children
  return children
}

export default ProtectedRoute

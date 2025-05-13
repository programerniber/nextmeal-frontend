"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getUsuarioAutenticado, loginUsuario, logoutUsuario } from "../api/usuarioService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Función para navegar sin depender de next/navigation
  const navigateTo = (path) => {
    window.location.href = path
  }

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar obtener usuario del localStorage primero para UI inmediata
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }

        // Luego verificar con el servidor
        const userData = await getUsuarioAutenticado()

        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(userData))

          // Redirigir a dashboard si está en login y autenticado
          if (window.location.pathname === "/login") {
            navigateTo("/dashboard")
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [])

  // Función para iniciar sesión
  const signin = async (credentials) => {
    setLoading(true)
    setErrors([])
    try {
      // Hacer login y obtener token y datos del usuario
      const response = await loginUsuario(credentials)
      console.log("Respuesta de login:", response)

      if (response.token) {
        localStorage.setItem("token", response.token)
      }

      if (response.usuario) {
        setUser(response.usuario)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(response.usuario))
        navigateTo("/dashboard")
        return response
      } else {
        throw new Error("No se recibieron datos de usuario")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setErrors([error.response?.data?.mensaje || "Credenciales incorrectas"])
      setIsAuthenticated(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para cerrar sesión
  const signout = async () => {
    try {
      await logoutUsuario()
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      navigateTo("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Limpiar datos de todas formas
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      navigateTo("/login")
    }
  }

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false
    return user.id_rol === role
  }

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (recurso, accion) => {
    if (!user || !user.permisos) return false

    // Si es administrador, tiene todos los permisos
    if (user.id_rol === 1) return true

    return user.permisos.some((p) => {
      if (typeof p === "string") {
        return p === recurso
      }
      return p.recurso === recurso && p.accion === accion
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        loading,
        errors,
        signin,
        signout,
        hasRole,
        hasPermission,
        navigateTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider")
  return context
}

// AuthProvider.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUsuarioAutenticado, loginUsuario, logoutUsuario } from "../api/usuarioService.js"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUsuarioAutenticado()
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("No autenticado:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [])

  const signin = async (credentials) => {
    setLoading(true);
    setErrors([]);
    console.log( credentials)
    try {
      // 1. Hacer login para establecer la cookie de sesión
      await loginUsuario(credentials);
      
      // 2. Obtener datos del usuario (con la cookie ahora establecida)
      const userData = await getUsuarioAutenticado();
      
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors([error.response?.data?.mensaje || "Error de autenticación"]);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  const signout = async () => {
    try {
      await logoutUsuario()
      setUser(null)
      setIsAuthenticated(false)
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.id_rol === role
  }

  const hasPermission = (recurso, accion) => {
    if (!user || !user.permisos) return false
    return user.permisos.some((p) => p.recurso === recurso && p.accion === accion)
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
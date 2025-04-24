"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getUsuarioAutenticado, loginUsuario, logoutUsuario } from "../api/usuarioService.js"
import { useNavigate } from "react-router-dom"


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const navigate = useNavigate()

  // Verificar autenticación al cargar la aplicación
useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUsuarioAutenticado();
        if (!userData) throw new Error("No user data");
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirigir a dashboard si está en login y autenticado
        if (window.location.pathname === '/login') {
          navigate("/dashboard");
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setIsLoadingAuth(false);
      }
    };
  
    checkAuth();
  }, [navigate]);

  // Función para iniciar sesión
  const signin = async (credentials) => {
    setLoading(true);
    setErrors([]);
    try {
      // 1. Primero hacer login
      await loginUsuario(credentials);
      console.log(credentials);
      // Pequeña pausa para asegurar que la cookie se establezca
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 2. Luego obtener datos del usuario
      const userData = await getUsuarioAutenticado();
      
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors([error.response?.data?.mensaje || "Credenciales incorrectas"]);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }
  
  // Función para cerrar sesión
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

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false
    return user.id_rol === role
  }

  // Verificar si el usuario tiene un permiso específico
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider")
  return context
}
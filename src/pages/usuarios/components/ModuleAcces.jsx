"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { obtenerPermisosUsuario } from "../api/usuarioService"
import { Package, TagsIcon as Categories, FileText, Users, Settings, AlertTriangle, DollarSign } from "lucide-react"

const ModuleAccess = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuth()
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarPermisos = async () => {
      if (!isAuthenticated || isLoadingAuth) return

      try {
        setLoading(true)
        const data = await obtenerPermisosUsuario()
        setPermisos(data.permisos || [])
      } catch (err) {
        console.error("Error al cargar permisos:", err)
        setError("No se pudieron cargar los permisos del usuario")
      } finally {
        setLoading(false)
      }
    }

    cargarPermisos()
  }, [isAuthenticated, isLoadingAuth])

  // Verificar si el usuario tiene permiso para un módulo específico
  const tienePermiso = (modulo) => {
    if (!isAuthenticated) return false

    // Administradores tienen acceso a todo
    if (user?.id_rol === 1) return true

    // Verificar si el usuario tiene algún permiso para este módulo
    return permisos.some(
      (permiso) => permiso.recurso === modulo && (permiso.accion === "crear" || permiso.accion === "editar"),
    )
  }

  // Definición de módulos con sus iconos y rutas
  const modulos = [
    {
      id: "productos",
      nombre: "Productos",
      icono: Package,
      ruta: "/productos",
      descripcion: "Gestionar catálogo de productos",
    },
    {
      id: "categorias",
      nombre: "Categorías",
      icono: Categories,
      ruta: "/categorias",
      descripcion: "Administrar categorías de productos",
    },
    { id: "ventas", nombre: "Ventas", icono: DollarSign, ruta: "/ventas", descripcion: "Gestionar ventas realizadas" },
    {
      id: "pedidos",
      nombre: "Pedidos",
      icono: FileText,
      ruta: "/pedidos",
      descripcion: "Administrar pedidos de clientes",
    },
    {
      id: "usuarios",
      nombre: "Usuarios",
      icono: Users,
      ruta: "/usuarios",
      descripcion: "Gestionar usuarios del sistema",
    },
    {
      id: "configuracion",
      nombre: "Configuración",
      icono: Settings,
      ruta: "/configuracion",
      descripcion: "Configurar roles y permisos",
    },
  ]

  // Filtrar módulos según permisos
  const modulosPermitidos = modulos.filter((modulo) => tienePermiso(modulo.id))

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 text-white p-4 rounded-lg border border-red-700 flex items-center">
        <AlertTriangle className="text-red-400 mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {modulosPermitidos.map((modulo) => {
        const IconComponent = modulo.icono

        return (
          <a
            key={modulo.id}
            href={modulo.ruta}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex flex-col items-center"
          >
            <div className="bg-orange-500/20 p-4 rounded-full mb-4">
              <IconComponent className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white">{modulo.nombre}</h3>
            <p className="text-gray-400 text-sm mt-2 text-center">{modulo.descripcion}</p>
          </a>
        )
      })}

      {modulosPermitidos.length === 0 && (
        <div className="col-span-full bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 flex items-center">
          <AlertTriangle className="text-yellow-500 mr-3 h-8 w-8" />
          <div>
            <h3 className="text-lg font-bold text-white">Sin acceso a módulos</h3>
            <p className="text-gray-300">No tienes permisos para acceder a ningún módulo del sistema.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleAccess

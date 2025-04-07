"use client"

import { useState, useEffect } from "react"
import { crearRol, actualizarRol } from "../api/rol"
import { crearPermiso, eliminarPermiso, obtenerPermisosPorUsuario } from "../api/permiso"
import { Shield, Save, X, AlertTriangle } from "lucide-react"

const RolForm = ({ onRolCreado, rolEditar, onCancel }) => {
  const [nombre, setNombre] = useState("")
  const [permisos, setPermisos] = useState({
    clientes: { crear: false, editar: false },
    productos: { crear: false, editar: false },
    ventas: { crear: false, editar: false },
    pedidos: { crear: false, editar: false },
    categorias: { crear: false, editar: false },
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [modo, setModo] = useState("crear")

  // Cargar datos si estamos editando
  useEffect(() => {
    const cargarDatosEdicion = async () => {
      if (rolEditar) {
        setNombre(rolEditar.nombre)
        setModo("editar")

        try {
          // Cargar permisos existentes
          const permisosExistentes = await obtenerPermisosPorUsuario(rolEditar.id)
          console.log("Permisos existentes:", permisosExistentes)

          // Resetear permisos
          const nuevosPermisos = {
            clientes: { crear: false, editar: false },
            productos: { crear: false, editar: false },
            ventas: { crear: false, editar: false },
            pedidos: { crear: false, editar: false },
            categorias: { crear: false, editar: false },
          }
          if (Array.isArray(permisosExistentes)) {
            permisosExistentes.forEach((permiso) => {
              if (nuevosPermisos[permiso.recurso]) {
                nuevosPermisos[permiso.recurso][permiso.accion] = permiso.activo
              }
            })
          } else {
            console.warn("permisosExistentes no es un array", permisosExistentes)
          }

          setPermisos(nuevosPermisos)
        } catch (err) {
          console.error("Error completo al cargar permisos:", err)
          setError(`Error al cargar permisos: ${err.message}`)
        }
      } else {
        // Resetear formulario
        setNombre("")
        setPermisos({
          clientes: { crear: false, editar: false },
          productos: { crear: false, editar: false },
          ventas: { crear: false, editar: false },
          pedidos: { crear: false, editar: false },
          categorias: { crear: false, editar: false },
        })
        setModo("crear")
      }
    }

    cargarDatosEdicion()
  }, [rolEditar])

  const handleCheckboxChange = (modulo, accion) => {
    setPermisos({
      ...permisos,
      [modulo]: {
        ...permisos[modulo],
        [accion]: !permisos[modulo][accion],
      },
    })
  }

  // Seleccionar todos los permisos de un módulo
  const selectAllForModule = (modulo) => {
    setPermisos({
      ...permisos,
      [modulo]: {
        crear: true,
        editar: true,
      },
    })
  }

  // Deseleccionar todos los permisos de un módulo
  const deselectAllForModule = (modulo) => {
    setPermisos({
      ...permisos,
      [modulo]: {
        crear: false,
        editar: false,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError("Debes ingresar un nombre para el rol")
      return
    }

    setCargando(true)
    setError("")

    try {
      let rolResultado

      if (modo === "crear") {
        // Crear rol
        rolResultado = await crearRol({ nombre })
      } else {
        // Actualizar rol
        rolResultado = await actualizarRol(rolEditar.id, { nombre })

        // Eliminar permisos existentes para recriarlos
        const permisosExistentes = await obtenerPermisosPorUsuario(rolEditar.id)
        for (const permiso of permisosExistentes) {
          await eliminarPermiso(permiso.id)
        }
      }

      // Crear permisos para este rol
      const permisosCreados = []

      for (const modulo in permisos) {
        for (const accion in permisos[modulo]) {
          if (permisos[modulo][accion]) {
            const permisoData = {
              id_usuario: rolResultado.id,
              recurso: modulo,
              accion: accion,
              activo: true,
            }
            const permisoCreado = await crearPermiso(permisoData)
            permisosCreados.push(permisoCreado)
          }
        }
      }

      // Notificar al componente padre
      if (onRolCreado) {
        onRolCreado({ ...rolResultado, permisos: permisosCreados })
      }
    } catch (err) {
      setError(`Error al ${modo === "crear" ? "crear" : "actualizar"} el rol: ${err.message}`)
    } finally {
      setCargando(false)
    }
  }

  // Verificar si hay al menos un permiso seleccionado
  const hayPermisosSeleccionados = Object.values(permisos).some((modulo) =>
    Object.values(modulo).some((valor) => valor),
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/50 text-white p-4 rounded-lg border border-red-700 flex flex-col items-start">
          <div className="flex items-start mb-2">
            <AlertTriangle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Verifica que el servidor API esté ejecutándose en http://localhost:3000 y que las rutas /api/roles y
            /api/permisos estén disponibles.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-orange-400 mb-2 font-medium" htmlFor="nombre">
            Nombre del Rol
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-gray-800 border border-orange-500/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Ej: Administrador, Vendedor, etc."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-orange-400 font-medium flex items-center">
              <Shield className="mr-2" size={18} />
              Permisos por Módulo
            </h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  const allModules = { ...permisos }
                  Object.keys(allModules).forEach((modulo) => {
                    allModules[modulo] = { crear: true, editar: true }
                  })
                  setPermisos(allModules)
                }}
                className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
              >
                Seleccionar Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  const allModules = { ...permisos }
                  Object.keys(allModules).forEach((modulo) => {
                    allModules[modulo] = { crear: false, editar: false }
                  })
                  setPermisos(allModules)
                }}
                className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                Deseleccionar Todos
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-white">
              <thead>
                <tr className="bg-gray-900/80">
                  <th className="text-left p-3 font-medium text-orange-300">Módulo</th>
                  <th className="text-center p-3 font-medium text-green-400">Crear</th>
                  <th className="text-center p-3 font-medium text-yellow-400">Editar</th>
                  <th className="text-center p-3 font-medium text-orange-300 w-24">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(permisos).map(([modulo, acciones], index) => {
                  const allSelected = acciones.crear && acciones.editar
                  const noneSelected = !acciones.crear && !acciones.editar

                  return (
                    <tr
                      key={modulo}
                      className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
                        index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-800"
                      }`}
                    >
                      <td className="p-3 capitalize font-medium">{modulo}</td>
                      <td className="p-3 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acciones.crear}
                            onChange={() => handleCheckboxChange(modulo, "crear")}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded ${
                              acciones.crear ? "bg-green-500 ring-2 ring-green-300/30" : "bg-gray-700 hover:bg-gray-600"
                            } flex items-center justify-center transition-all duration-200`}
                          >
                            {acciones.crear && <span className="text-white text-xs">✓</span>}
                          </div>
                        </label>
                      </td>
                      <td className="p-3 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acciones.editar}
                            onChange={() => handleCheckboxChange(modulo, "editar")}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded ${
                              acciones.editar
                                ? "bg-yellow-500 ring-2 ring-yellow-300/30"
                                : "bg-gray-700 hover:bg-gray-600"
                            } flex items-center justify-center transition-all duration-200`}
                          >
                            {acciones.editar && <span className="text-white text-xs">✓</span>}
                          </div>
                        </label>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => selectAllForModule(modulo)}
                            disabled={allSelected}
                            className={`text-xs px-2 py-1 rounded ${
                              allSelected
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                          >
                            Todo
                          </button>
                          <button
                            type="button"
                            onClick={() => deselectAllForModule(modulo)}
                            disabled={noneSelected}
                            className={`text-xs px-2 py-1 rounded ${
                              noneSelected
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            }`}
                          >
                            Nada
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!hayPermisosSeleccionados && (
            <p className="mt-2 text-yellow-500 text-sm flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              Selecciona al menos un permiso para este rol
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
          >
            <X size={18} className="mr-1" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando || !nombre.trim() || !hayPermisosSeleccionados}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-5 rounded-lg transition duration-200 flex items-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {cargando ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </span>
            ) : (
              <>
                <Save size={18} className="mr-1" /> {modo === "crear" ? "Guardar Rol" : "Actualizar Rol"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RolForm


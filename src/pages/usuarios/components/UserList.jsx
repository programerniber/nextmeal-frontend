"use client"

import { useState } from "react"
import {
  Edit,
  Trash2,
  User,
  Shield,
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react"
import UserDetailModal from "../modals/UserDetailModal"

const UserList = ({ usuarios, onEdit, onDelete, onToggleEstado, isAdmin }) => {
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailModal, setShowDetailModal] = useState(null)
  const itemsPerPage = 5

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cedula?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginación
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsuarios = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage)

  // Función para renderizar el rol del usuario
  const renderRol = (rolId) => {
    switch (rolId) {
      case 1:
        return <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full text-xs">Administrador</span>
      case 2:
        return <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">Empleado</span>
      case 3:
        return <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs">Cliente</span>
      default:
        return <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">Sin rol</span>
    }
  }

  const handleViewDetails = (usuario) => {
    setShowDetailModal(usuario)
  }

  return (
    <div>
      {/* Búsqueda */}
      <div className="flex items-center mb-6 bg-gray-900 border border-gray-700 rounded-lg p-2">
        <Search className="text-gray-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre, email o cédula..."
          className="w-full bg-transparent border-none text-white focus:outline-none px-3 py-2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // Resetear a primera página al buscar
          }}
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {paginatedUsuarios.length > 0 ? (
              paginatedUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-orange-400" />
                      {usuario.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-gray-400" />
                      {renderRol(usuario.id_rol)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleEstado(usuario)}
                      disabled={!isAdmin}
                      className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
                        usuario.estado === "activo"
                          ? "bg-green-900 text-green-300 border border-green-500 hover:bg-green-800"
                          : "bg-red-900 text-red-300 border border-red-500 hover:bg-red-800"
                      } ${!isAdmin ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      title={
                        isAdmin
                          ? `Cambiar a ${usuario.estado === "activo" ? "inactivo" : "activo"}`
                          : "No tienes permisos para cambiar el estado"
                      }
                    >
                      {usuario.estado === "activo" ? (
                        <>
                          <ToggleRight size={16} className="mr-1" /> Activo
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} className="mr-1" /> Inactivo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(usuario)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(usuario)}
                            className="text-gray-400 hover:text-orange-400 p-1"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(usuario)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-300">
              Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsuarios.length)} de{" "}
              {filteredUsuarios.length} usuarios
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="text-white border border-gray-600 p-2 rounded disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-white border border-gray-600 p-2 rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-orange-600 text-white border border-orange-500"
                      : "text-white border border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-white border border-gray-600 p-2 rounded disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="text-white border border-gray-600 p-2 rounded disabled:opacity-50"
              >
                <ChevronRight size={18} />
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles de usuario */}
      {showDetailModal && <UserDetailModal usuario={showDetailModal} onClose={() => setShowDetailModal(null)} />}
    </div>
  )
}

export default UserList

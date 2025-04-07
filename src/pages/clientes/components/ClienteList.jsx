"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Search, RefreshCw, Eye, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react"
import { deleteCliente, toggleClienteEstado } from "../api/clienteService"
import ClienteDetailModal from "../modals/ClienteDetailModal"
import DeleteConfirmModal from "../modals/DeleteConfirmModal"

const ClienteList = ({ clientes, onEdit, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState(null)
  const [showDetail, setShowDetail] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionError, setActionError] = useState("")

  const itemsPerPage = 5

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredClientes = clientes.filter((cliente) =>
    [cliente.nombreCompleto, cliente.documentoIdentidad, cliente.correoElectronico]
      .join(" ")
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClientes = filteredClientes.slice(startIndex, startIndex + itemsPerPage)

  const handleDeleteClick = (cliente) => {
    setClienteToDelete(cliente)
    setIsDeleting(true)
    setActionError("")
  }

  const confirmDelete = async () => {
    try {
      setActionError("")
      console.log("Eliminando cliente:", clienteToDelete)
      await deleteCliente(clienteToDelete.id)
      onDelete()
      setIsDeleting(false)
      setClienteToDelete(null)
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      setActionError(error.message || "Error al eliminar cliente")
    }
  }

  // Función corregida para cambiar el estado
  const handleToggleEstado = async (cliente) => {
    try {
      setIsUpdating(true)
<<<<<<< HEAD
      setActionError("")
      console.log("Cambiando estado del cliente:", cliente)
      // Ahora pasamos el estado actual como segundo parámetro
      await toggleClienteEstado(cliente.id, cliente.estado)
      onRefresh()
=======
      const estadoCambiar = cliente.estado == "activo" ? "inactivo" : "activo"
      await toggleClienteEstado(cliente.id, {estado:estadoCambiar})
      onRefresh() // Recargar la lista
>>>>>>> ef5691537d35a5fa42e88f18dc7b82b9c7a71742
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error)
      setActionError(error.message || "Error al cambiar estado del cliente")
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para manejar el clic en el botón de editar
  const handleEditClick = (cliente) => {
    // Aquí simplemente pasamos el cliente al componente padre
    // sin hacer nada más que podría interferir con el flujo
    if (onEdit && typeof onEdit === "function") {
      onEdit(cliente)
    }
  }

  return (
    <div>
      {/* Mensaje de error */}
      {actionError && (
        <div className="bg-red-900 text-white p-3 rounded-lg mb-4 animate-pulse border border-red-500 text-sm">
          {actionError}
        </div>
      )}

      {/* Búsqueda */}
      <div className="flex items-center mb-6 bg-gray-900 border border-gray-700 rounded-lg p-2">
        <Search className="text-gray-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre, documento o correo..."
          className="w-full bg-transparent border-none text-white focus:outline-none px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchTerm("")
            onRefresh()
          }}
          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
          title="Refrescar"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginatedClientes.length > 0 ? (
              paginatedClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-white text-sm">{cliente.nombreCompleto}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {cliente.tipoDocumento}: {cliente.documentoIdentidad}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{cliente.correoElectronico}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{cliente.telefono}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleEstado(cliente)}
                      disabled={isUpdating}
                      className={`px-2 inline-flex items-center text-xs font-semibold rounded-full ${
                        cliente.estado === "activo"
                          ? "bg-green-900 text-green-300 border border-green-500 hover:bg-green-800"
                          : "bg-red-900 text-red-300 border border-red-500 hover:bg-red-800"
                      }`}
                      title={`Cambiar a ${cliente.estado === "activo" ? "inactivo" : "activo"}`}
                    >
                      {cliente.estado === "activo" ? (
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
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowDetail(cliente)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(cliente)}
                        className="text-orange-500 hover:text-orange-400"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cliente)}
                        className="text-red-500 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  No se encontraron clientes
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
              Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredClientes.length)} de{" "}
              {filteredClientes.length} clientes
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

      {/* Modales */}
      {showDetail && (
        <ClienteDetailModal
          cliente={showDetail}
          onClose={() => setShowDetail(null)}
          onEdit={() => {
            // Primero cerramos el modal de detalles
            setShowDetail(null)
            // Luego, con un pequeño retraso, abrimos el modo de edición
            setTimeout(() => {
              handleEditClick(showDetail)
            }, 100)
          }}
        />
      )}

      {isDeleting && (
        <DeleteConfirmModal
          cliente={clienteToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleting(false)
            setClienteToDelete(null)
            setActionError("")
          }}
        />
      )}
    </div>
  )
}

export default ClienteList


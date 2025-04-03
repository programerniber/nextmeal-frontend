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

  const itemsPerPage = 5 // Reducido para mostrar mejor la paginación

  // Implementar debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Resetear a la primera página cuando se busca
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombreCompleto.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      cliente.documentoIdentidad.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      cliente.correoElectronico.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )

  // Calcular páginas
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClientes = filteredClientes.slice(startIndex, startIndex + itemsPerPage)

  const handleDeleteClick = (cliente) => {
    setClienteToDelete(cliente)
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCliente(clienteToDelete.id)
      onDelete() // Recargar la lista
      setIsDeleting(false)
      setClienteToDelete(null)
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
    }
  }

  // Función para cambiar el estado de un cliente
  const handleToggleEstado = async (cliente) => {
    try {
      setIsUpdating(true)
      const estadoCambiar = cliente.estado == "activo" ? "inactivo" : "activo"
      await toggleClienteEstado(cliente.id, {estado:estadoCambiar})
      onRefresh() // Recargar la lista
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Componente para renderizar una fila de la tabla
  const ClienteRow = ({ cliente }) => (
    <tr className="hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{cliente.nombreCompleto}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {cliente.tipoDocumento}: {cliente.documentoIdentidad}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.correoElectronico}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cliente.telefono}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => handleToggleEstado(cliente)}
          disabled={isUpdating}
          className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
            cliente.estado === "activo"
              ? "bg-green-900 text-green-300 border border-green-500 hover:bg-green-800"
              : "bg-red-900 text-red-300 border border-red-500 hover:bg-red-800"
          } transition-colors`}
          title={`Cambiar a ${cliente.estado === "activo" ? "inactivo" : "activo"}`}
        >
          {cliente.estado === "activo" ? (
            <>
              <ToggleRight size={16} className="mr-1" />
              Activo
            </>
          ) : (
            <>
              <ToggleLeft size={16} className="mr-1" />
              Inactivo
            </>
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetail(cliente)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
            title="Ver detalles"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(cliente)}
            className="text-orange-500 hover:text-orange-400 transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(cliente)}
            className="text-red-500 hover:text-red-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )

  // Componente para la barra de búsqueda
  const SearchBar = () => (
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
  )

  // Componente para la paginación mejorada
  const Pagination = () => {
    if (totalPages <= 1) return null

    // Determinar qué páginas mostrar
    const getPageNumbers = () => {
      const pageNumbers = []
      const maxPagesToShow = 5

      if (totalPages <= maxPagesToShow) {
        // Si hay menos páginas que el máximo a mostrar, mostrar todas
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // Siempre mostrar la primera página
        pageNumbers.push(1)

        // Calcular el rango de páginas alrededor de la página actual
        let startPage = Math.max(2, currentPage - 1)
        let endPage = Math.min(totalPages - 1, currentPage + 1)

        // Ajustar si estamos cerca del inicio o final
        if (currentPage <= 2) {
          endPage = 4
        } else if (currentPage >= totalPages - 1) {
          startPage = totalPages - 3
        }

        // Agregar elipsis si es necesario
        if (startPage > 2) {
          pageNumbers.push("...")
        }

        // Agregar páginas del rango
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i)
        }

        // Agregar elipsis si es necesario
        if (endPage < totalPages - 1) {
          pageNumbers.push("...")
        }

        // Siempre mostrar la última página
        if (totalPages > 1) {
          pageNumbers.push(totalPages)
        }
      }

      return pageNumbers
    }

    return (
      <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-300">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredClientes.length)} de{" "}
            {filteredClientes.length} clientes
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700 border border-gray-600"
              }`}
              title="Primera página"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700 border border-gray-600"
              }`}
              title="Página anterior"
            >
              <ChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-orange-600 text-white border border-orange-500"
                      : "text-white hover:bg-gray-700 border border-gray-600"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700 border border-gray-600"
              }`}
              title="Página siguiente"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-gray-700 border border-gray-600"
              }`}
              title="Última página"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SearchBar />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <thead className="bg-gray-900 text-orange-500 border-b border-orange-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedClientes.length > 0 ? (
              paginatedClientes.map((cliente) => <ClienteRow key={cliente.id} cliente={cliente} />)
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                  {debouncedSearchTerm ? (
                    <div className="flex flex-col items-center">
                      <Search size={24} className="mb-2 text-gray-500" />
                      <p>No se encontraron clientes que coincidan con "{debouncedSearchTerm}"</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-orange-500 hover:text-orange-400 underline"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mb-2 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <p>No hay clientes registrados</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination />

      {/* Modales */}
      {isDeleting && (
        <DeleteConfirmModal
          cliente={clienteToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleting(false)
            setClienteToDelete(null)
          }}
        />
      )}

      {showDetail && (
        <ClienteDetailModal
          cliente={showDetail}
          onClose={() => setShowDetail(null)}
          onEdit={() => {
            onEdit(showDetail)
            setShowDetail(null)
          }}
        />
      )}
    </div>
  )
}

export default ClienteList


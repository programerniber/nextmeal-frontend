"use client"

import { useState } from "react"
import { Edit, Trash2, Eye } from "lucide-react"
import DeleteConfirmModal from "../modals/DeleteConfirmModal"
import CategoriaDetailModal from "../modals/CategoriaDetailModal"
import { deleteCategoria } from "../api/categoriaService"

const CategoriaList = ({ categorias, onEdit, onRefresh }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)

  const handleViewClick = (categoria) => {
    setSelectedCategoria(categoria)
    setShowDetailModal(true)
  }

  const handleDeleteClick = (categoria) => {
    setSelectedCategoria(categoria)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteCategoria(selectedCategoria.id)
      onRefresh()
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      // Puedes mostrar un mensaje de error al usuario si lo deseas
    } finally {
      setShowDeleteModal(false)
    }
  }
  if (!Array.isArray(categorias)) {
    console.error("Error: categorias no es un array", categorias)
    return <p className="text-red-500">Error al cargar las categorías.</p>
  }

  return (
    <>
      {categorias.length > 0 ? (
        categorias.map((categoria) => (
          <div key={categoria.id} className="p-4 bg-gray-800 rounded-lg mb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 cursor-pointer" onClick={() => handleViewClick(categoria)}>
                <h3 className="text-white text-lg font-semibold">{categoria.nombre}</h3>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewClick(categoria)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title="Ver detalles"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onEdit(categoria)}
                className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteClick(categoria)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No hay categorías disponibles.</p>
      )}

      {showDetailModal && (
        <CategoriaDetailModal
          categoria={selectedCategoria}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false)
            onEdit(selectedCategoria)
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          item={selectedCategoria}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          itemName="categoría"
          itemField="nombre"
        />
      )}
    </>
  )
}

export default CategoriaList

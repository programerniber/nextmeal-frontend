"use client"

import { Tag, DollarSign, Edit } from "lucide-react"

const ProductoDetailModal = ({ producto, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-[600px] border-2 border-orange-500 animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
          Detalles del Producto
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <Tag size={32} className="text-orange-500" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{producto.nombre}</h4>
              {producto.categoria && (
                <p className="text-gray-400 text-sm">
                  Categoría: {producto.categoria.nombre}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400">
                <DollarSign size={20} />
                <span className="font-medium">Precio</span>
              </div>
              <p className="text-white text-xl mt-1">
                ${producto.precio?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                <Tag size={20} />
                <span className="font-medium">Estado</span>
              </div>
              <p className={`mt-1 capitalize ${
                producto.estado === 'activo' 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {producto.estado || 'activo'}
              </p>
            </div>
          </div>

          {producto.descripcion && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300">{producto.descripcion}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 border border-orange-500"
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetailModal
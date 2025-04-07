"use client"

const DeleteConfirmModal = ({ item, onConfirm, onCancel, itemName = "item", itemField = "name" }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-96 border-2 border-orange-500 animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4">Confirmar eliminación</h3>
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que deseas eliminar {itemName} {" "}
          <span className="font-semibold text-orange-400">{item?.[itemField]}</span>? Esta acción no se puede
          deshacer.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border border-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
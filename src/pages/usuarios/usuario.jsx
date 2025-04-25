"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Users, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { fetchUsuarios, deleteUsuario, toggleUsuarioEstado } from "./api/usuarioService"
import UserList from "./components/UserList"
import UserForm from "./components/UserForm"
import DeleteConfirmModal from "../clientes/modals/DeleteConfirmModal"
import { useAuth } from "./context/AuthContext"

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [currentUsuario, setCurrentUsuario] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)
  const { user } = useAuth()

  // Verificar si el usuario tiene permisos de administrador
  const isAdmin = user?.id_rol === 1 // Asumiendo que 1 es el ID del rol administrador

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await fetchUsuarios()
      setUsuarios(data || [])
      setError(null)
    } catch (err) {
      setError("Error al cargar los usuarios: " + (err.message || "Error desconocido"))
      console.error("Error al cargar usuarios:", err)
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setCurrentUsuario(null)
    setShowForm(true)
  }

  const handleEditClick = (usuario) => {
    setCurrentUsuario(usuario)
    setShowEditConfirm(true)
  }

  const confirmEdit = () => {
    setShowEditConfirm(false)
    setShowForm(true)
  }

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUsuario(usuarioToDelete.id)
      setShowDeleteConfirm(false)
      setUsuarioToDelete(null)
      setActionSuccess(`Usuario ${usuarioToDelete.nombre} eliminado correctamente`)
      loadUsuarios()
    } catch (error) {
      setError(`Error al eliminar usuario: ${error.message || "Error desconocido"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleEstado = async (usuario) => {
    try {
      await toggleUsuarioEstado(usuario.id, usuario.estado)
      setActionSuccess(`Estado de ${usuario.nombre} cambiado correctamente`)
      loadUsuarios()
    } catch (error) {
      setError(`Error al cambiar estado: ${error.message || "Error desconocido"}`)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setCurrentUsuario(null)
  }

  const handleUsuarioSaved = () => {
    loadUsuarios()
    setShowForm(false)
    setCurrentUsuario(null)
    setActionSuccess(currentUsuario ? "Usuario actualizado correctamente" : "Usuario creado correctamente")
  }

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (actionSuccess || error) {
      const timer = setTimeout(() => {
        setActionSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess, error])

  return (
    <div className="container mx-auto px-4 py-6 h-full overflow-hidden">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-xl p-6 border-l-4 border-orange-500 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg mr-4 shadow-lg shadow-orange-500/20">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
              <p className="text-gray-400 text-sm">Administra los usuarios del sistema</p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlusCircle size={20} />
              <span>Registrar Usuario</span>
            </button>
          )}
        </div>

        {/* Mensajes de éxito */}
        {actionSuccess && (
          <div className="bg-green-900 text-white p-4 rounded-lg mb-6 border border-green-500 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
            {actionSuccess}
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6 animate-pulse border border-red-500 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg border border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex-grow overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Users size={18} className="mr-2 text-orange-400" />
                Lista de Usuarios
              </h2>
              <button
                onClick={loadUsuarios}
                className="p-2 text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1"
                title="Refrescar"
              >
                <RefreshCw size={16} />
                <span>Actualizar</span>
              </button>
            </div>
            <UserList
              usuarios={usuarios}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleEstado={handleToggleEstado}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </div>

      {/* Modal de formulario para crear/editar usuario */}
      {showForm && <UserForm usuario={currentUsuario} onClose={handleFormClose} onSave={handleUsuarioSaved} />}

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="Eliminar Usuario"
          message={`¿Estás seguro de eliminar al usuario ${usuarioToDelete?.nombre}? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setUsuarioToDelete(null)
          }}
          isLoading={isDeleting}
        />
      )}

      {/* Modal de confirmación para editar */}
      {showEditConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-orange-500 animate-fade-in p-6">
            <h3 className="text-xl font-bold text-white mb-4">Editar Usuario</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas editar al usuario {currentUsuario?.nombre}?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Usuario

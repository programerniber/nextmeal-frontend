
import { useState, useEffect } from "react"
import UserList from "./components/UserList"
import UserForm from "./components/UserForm"
import { fetchUsuarios } from "./api/usuarioService.js"
import { PlusCircle, Users, RefreshCw } from "lucide-react"

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [currentUsuario, setCurrentUsuario] = useState(null)

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
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setCurrentUsuario(null)
  }

  const handleUsuarioUpdated = () => {
    loadUsuarios()
    setShowForm(false)
    setCurrentUsuario(null)
  }

  // Verificar si el usuario tiene permisos de administrador
  const isAdmin = user?.id_rol === 1 // Asumiendo que 1 es el ID del rol administrador

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl shadow-xl p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg mr-4 shadow-lg shadow-blue-500/20">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlusCircle size={20} />
              <span>Registrar Usuario</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6 animate-pulse border border-red-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg border border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Users size={18} className="mr-2 text-blue-400" />
                Lista de Usuarios
              </h2>
              <button
                onClick={loadUsuarios}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1"
                title="Refrescar"
              >
                <RefreshCw size={16} />
                <span>Actualizar</span>
              </button>
            </div>
            <UserList
              usuarios={usuarios}
              onEdit={handleEditClick}
              onDelete={loadUsuarios}
              onRefresh={loadUsuarios}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </div>

      {showForm && (
        <UserForm 
          usuario={currentUsuario} 
          onClose={handleFormClose} 
          onSave={handleUsuarioUpdated} 
        />
      )}
    </div>
  )
}

export default Usuario
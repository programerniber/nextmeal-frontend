import { Edit, Trash2, User, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const UserList = ({ usuarios, onEdit, onDelete, isAdmin }) => {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {usuarios.map((usuario) => (
            <>
              <tr key={usuario.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{usuario.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    {usuario.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${usuario.id_rol === 1 ? 'bg-purple-900 text-purple-300' : 
                      usuario.id_rol === 2 ? 'bg-blue-900 text-blue-300' : 
                      'bg-gray-700 text-gray-300'}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {usuario.Rol?.nombre || 'Sin rol'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => toggleExpand(usuario.id)}
                      className="text-gray-400 hover:text-blue-500 p-1"
                    >
                      {expandedId === usuario.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(usuario)}
                          className="text-gray-400 hover:text-yellow-500 p-1"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
                              try {
                                await deleteUsuario(usuario.id)
                                onDelete()
                              } catch (error) {
                                console.error("Error deleting usuario:", error)
                              }
                            }
                          }}
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
              
              {expandedId === usuario.id && (
                <tr className="bg-gray-800/50">
                  <td colSpan="5" className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">ID:</p>
                        <p className="text-white">{usuario.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Nombre:</p>
                        <p className="text-white">{usuario.nombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">{usuario.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Rol:</p>
                        <p className="text-white">{usuario.Rol?.nombre || 'Sin rol'}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      
      {usuarios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay usuarios registrados
        </div>
      )}
    </div>
  )
}

export default UserList
import axios from "axios"

// Ruta base de la API
const VITE_API_URL = "http://localhost:3000/api"

// Función para obtener los headers de autorización
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

// Obtener todos los roles
export const obtenerRoles = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/rol`, {
      headers: getAuthHeaders(),
    })
    return response.data.data
  } catch (error) {
    console.error("Error al obtener roles:", error)
    throw new Error(error.response?.data?.message || "Error al obtener roles")
  }
}

// Obtener un rol específico por ID
export const obtenerRolPorId = async (id) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/rol/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data.data
  } catch (error) {
    console.error(`Error al obtener rol con ID ${id}:`, error)
    throw new Error(error.response?.data?.message || `Error al obtener rol con ID ${id}`)
  }
}

// Crear un nuevo rol
export const crearRol = async (rolData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/rol`, rolData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    })
    return response.data.data
  } catch (error) {
    console.error("Error al crear rol:", error)
    throw new Error(error.response?.data?.message || "Error al crear rol")
  }
}

// Actualizar un rol existente
export const actualizarRol = async (id, rolData) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/rol/${id}`, rolData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    })
    return response.data.data
  } catch (error) {
    console.error(`Error al actualizar rol con ID ${id}:`, error)
    throw new Error(error.response?.data?.message || `Error al actualizar rol con ID ${id}`)
  }
}

// Eliminar un rol
export const eliminarRol = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/rol/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error(`Error al eliminar rol con ID ${id}:`, error)
    throw new Error(error.response?.data?.mensaje || `Error al eliminar rol con ID ${id}`)
  }
}

import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api"

// ✅ Crear categoría (POST)
export const createCategoria = async (categoryData) => {
  try {
    const res = await axios.post(`${VITE_API_URL}/categoria`, categoryData)
    return res.data.data
  } catch (error) {
    if (error.response?.data?.errores) {
      console.error("Errores del backend:", error.response.data.errores)
      error.response.data.errores.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err)
      })
      const errorMessage = error.response.data.errores
        .map((err) => (typeof err === "string" ? err : err.mensaje || JSON.stringify(err)))
        .join(", ")
      error.message = errorMessage || error.message
    } else if (error.response?.data?.mensaje) {
      console.error("Mensaje de error del backend:", error.response.data.mensaje)
      error.message = error.response.data.mensaje
    } else {
      console.error("Error al crear categoría:", error.message)
    }
    throw error
  }
}

// ✅ Obtener todas las categorías (GET)
export const fetchCategorias = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/categoria`)
    return res.data.data
  } catch (error) {
    console.error("Error al obtener categorías", error)
    throw error
  }
}

// ✅ Obtener categoría por ID (GET)
export const fetchCategoriaById = async (id) => {
  try {
    const res = await axios.get(`${VITE_API_URL}/categoria/${id}`)
    return res.data.data
  } catch (error) {
    console.error("Error al obtener categoría por ID", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Actualizar categoría por ID (PUT)
export const updateCategoria = async (id, categoryData) => {
  try {
    const res = await axios.put(`${VITE_API_URL}/categoria/${id}`, categoryData)
    return res.data.data
  } catch (error) {
    console.error("Error al actualizar categoría", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Eliminar categoría por ID (DELETE)
export const deleteCategoria = async (id) => {
  try {
    console.log(`Eliminando categoría con ID: ${id}`)
    const res = await axios.delete(`${VITE_API_URL}/categoria/${id}`)
    console.log("Categoría eliminada:", res.data.message || res.data)
    return res.data
  } catch (error) {
    console.error("Error al eliminar categoría", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Cambiar estado de la categoría (PATCH)
export const toggleCategoriaEstado = async (id, estadoActual) => {
  try {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"
    console.log(`Cambiando estado de categoría ${id} de ${estadoActual} a ${nuevoEstado}`)

    const res = await axios.patch(`${VITE_API_URL}/categoria/${id}/estado`, {
      estado: nuevoEstado,
    })

    console.log("Estado de categoría actualizado:", res.data.data)
    return res.data.data
  } catch (error) {
    console.error("Error al cambiar estado de categoría", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}